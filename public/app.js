(() => {
  const STORAGE_USER = "traveloop_user";
  const STORAGE_TRIPS = "traveloop_trips";
  const STORAGE_BOOKINGS = "traveloop_bookings";
  const STORAGE_FOLLOWS = "traveloop_follows";
  const STORAGE_SETTINGS = "traveloop_settings";

  let catalog = null;

  function loadJson(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  function getUser() {
    return loadJson(STORAGE_USER, null);
  }

  function setUser(u) {
    if (u) saveJson(STORAGE_USER, u);
    else localStorage.removeItem(STORAGE_USER);
  }

  function getTrips() {
    return loadJson(STORAGE_TRIPS, []);
  }

  function saveTrips(trips) {
    saveJson(STORAGE_TRIPS, trips);
  }

  function getBookings() {
    return loadJson(STORAGE_BOOKINGS, []);
  }

  function saveBookings(b) {
    saveJson(STORAGE_BOOKINGS, b);
  }

  function getFollows() {
    return loadJson(STORAGE_FOLLOWS, []);
  }

  function saveFollows(f) {
    saveJson(STORAGE_FOLLOWS, f);
  }

  function getSettings() {
    return loadJson(STORAGE_SETTINGS, { notifPush: true, notifEmail: true, lang: "English" });
  }

  function saveSettings(s) {
    saveJson(STORAGE_SETTINGS, s);
  }

  async function fetchCatalog() {
    if (catalog) return catalog;
    const res = await fetch("/api/data");
    catalog = await res.json();
    return catalog;
  }

  function parseRoute() {
    const full = location.hash.slice(1) || "/home";
    const pathOnly = full.split("?")[0];
    const raw = pathOnly.replace(/^\//, "");
    const parts = raw.split("/").filter(Boolean);
    const name = parts[0] || "home";
    return { name, parts };
  }

  function navigate(to) {
    location.hash = to.startsWith("#") ? to : `#${to}`;
  }

  let toastTimer;
  function toast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function requireAuth(routeName) {
    const user = getUser();
    const publicRoutes = new Set(["login", "register"]);
    if (!user && !publicRoutes.has(routeName)) {
      navigate("/login");
      return false;
    }
    if (user && publicRoutes.has(routeName)) {
      navigate("/home");
      return false;
    }
    return true;
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function tripStatus(trip) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(trip.startDate + "T12:00:00");
    const end = new Date(trip.endDate + "T12:00:00");
    if (end < today) return "completed";
    if (start > today) return "upcoming";
    return "ongoing";
  }

  function tripSpent(tripId) {
    return getBookings()
      .filter((b) => b.tripId === tripId)
      .reduce((s, b) => s + b.price, 0);
  }

  function categorySpendForTrip(tripId) {
    const map = {};
    getBookings()
      .filter((b) => b.tripId === tripId)
      .forEach((b) => {
        const k = b.expenseCategory || "Activities";
        map[k] = (map[k] || 0) + b.price;
      });
    return map;
  }

  function bottomNav(active) {
    const items = [
      { id: "home", hash: "/home", label: "Home", icon: "⌂" },
      { id: "trips", hash: "/trips", label: "Trips", icon: "✈" },
      { id: "community", hash: "/community", label: "Community", icon: "💬" },
      { id: "profile", hash: "/profile", label: "Profile", icon: "◎" },
    ];
    return `
      <nav class="bottom-nav" aria-label="Main">
        ${items
          .map(
            (x) => `
          <button type="button" class="${active === x.id ? "active" : ""}" data-nav="${x.hash}">
            <span class="ico">${x.icon}</span>
            ${x.label}
          </button>`
          )
          .join("")}
      </nav>
      <div id="toast" class="toast" role="status"></div>
    `;
  }

  function attachNavHandlers() {
    document.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => navigate(btn.getAttribute("data-nav")));
    });
  }

  function bindGlobalClicks() {
    document.querySelectorAll("[data-go]").forEach((el) => {
      el.addEventListener("click", () => navigate(el.getAttribute("data-go")));
    });
    document.querySelector("[data-back]")?.addEventListener("click", () => history.back());
  }

  /* ---------- Screens ---------- */

  function ScreenLogin() {
    return `
      <div class="screen">
        <div class="logo-mark" aria-hidden="true">✦</div>
        <div class="auth-card">
          <h2>Welcome back</h2>
          <p class="sub">Sign in to plan trips, track budget, and browse the community.</p>
          <form id="form-login">
            <div class="field">
              <label for="username">Username</label>
              <input id="username" name="username" autocomplete="username" required />
            </div>
            <div class="field">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required />
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
          <p class="auth-switch">No account? <a href="#/register">Sign up</a></p>
        </div>
      </div>
    `;
  }

  function ScreenRegister() {
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Create account</h1>
        </div>
        <div class="auth-card">
          <form id="form-register">
            <div class="field"><label for="fn">First name</label><input id="fn" required /></div>
            <div class="field"><label for="ln">Last name</label><input id="ln" required /></div>
            <div class="field"><label for="em">Email address</label><input id="em" type="email" required /></div>
            <div class="field"><label for="ph">Phone number</label><input id="ph" type="tel" /></div>
            <div class="field"><label for="city">City</label><input id="city" /></div>
            <div class="field"><label for="country">Country</label><input id="country" /></div>
            <button type="submit" class="btn btn-primary">Sign up</button>
          </form>
          <p class="auth-switch">Already have an account? <a href="#/login">Login</a></p>
        </div>
      </div>
    `;
  }

  function ScreenHome() {
    return `
      <div class="screen">
        <div class="top-bar">
          <h1>Discover</h1>
          <button type="button" class="btn-icon" data-go="/notifications" aria-label="Notifications">🔔</button>
        </div>
        <div class="search-bar">
          <span aria-hidden="true">🔍</span>
          <input type="search" placeholder="Search destinations…" data-go="/search" readonly style="cursor:pointer" />
        </div>
        <div class="banner">
          <h2>Plan smarter trips</h2>
          <p>Destinations, itineraries, budgets, and receipts in one flow.</p>
        </div>
        <h2 class="section-title">Categories</h2>
        <div class="cat-row" id="home-cats">
          ${catalog.categories
            .map(
              (c) => `
            <div class="cat-chip">
              <button type="button" data-cat="${c.id}" title="${c.label}">${c.icon}</button>
              <span>${c.label}</span>
            </div>`
            )
            .join("")}
        </div>
        <h2 class="section-title">Popular places</h2>
        <div class="place-grid">
          ${catalog.places
            .map(
              (p) => `
            <button type="button" class="place-card" data-go="/destination/${p.id}">
              <img src="${p.image}" alt="" loading="lazy" />
              <div class="meta">
                <h3>${escapeHtml(p.name)}</h3>
                <p class="price">From $${p.priceFrom}</p>
              </div>
            </button>`
            )
            .join("")}
        </div>
      </div>
      ${bottomNav("home")}
    `;
  }

  function ScreenDestination(placeId) {
    const place = catalog.places.find((p) => p.id === placeId);
    if (!place) {
      return `<div class="screen"><p class="empty-hint">Destination not found.</p></div>${bottomNav("home")}`;
    }
    const gallery = place.gallery || [];
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>${escapeHtml(place.name)}</h1>
        </div>
        <div class="hero-detail">
          <img src="${place.image}" alt="" loading="lazy" />
        </div>
        <p style="margin:0 0 12px;color:var(--muted);font-size:0.95rem">${escapeHtml(place.blurb)}</p>
        <h2 class="section-title">Gallery</h2>
        <div class="gallery-row">
          ${gallery.map((url) => `<img src="${url}" alt="" loading="lazy" />`).join("")}
        </div>
        <button type="button" class="btn btn-primary" data-go="/plan-trip?dest=${encodeURIComponent(place.id)}">Plan trip</button>
        <button type="button" class="btn btn-secondary" style="margin-top:10px" data-go="/activity-list/${place.id}">
          Browse activities
        </button>
      </div>
      ${bottomNav("home")}
    `;
  }

  function ScreenSearch() {
    const today = new Date().toISOString().slice(0, 10);
    const end = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Search</h1>
        </div>
        <div class="search-bar">
          <span>🔍</span>
          <input type="search" id="filter-q" placeholder="Name or country…" />
        </div>
        <div class="filter-block">
          <strong>Filter by</strong>
          <div class="row-2" style="margin-top:12px">
            <div class="field" style="margin:0">
              <label for="start">Start date</label>
              <input type="date" id="start" value="${today}" />
            </div>
            <div class="field" style="margin:0">
              <label for="end">End date</label>
              <input type="date" id="end" value="${end}" />
            </div>
          </div>
          <div class="field">
            <label for="price">Max price (from)</label>
            <div class="range-wrap">
              <input type="range" id="price" min="300" max="2000" step="50" value="1500" />
              <div id="price-label" style="font-size:0.85rem;color:var(--muted);margin-top:6px">Up to $1500</div>
            </div>
          </div>
        </div>
        <h2 class="section-title">Categories</h2>
        <div class="category-grid" id="filter-cats">
          <button type="button" class="pill active" data-cat="">All</button>
          ${catalog.categories.map((c) => `<button type="button" class="pill" data-cat="${c.id}">${c.label}</button>`).join("")}
        </div>
        <h2 class="section-title" style="margin-top:18px">Results</h2>
        <div class="place-grid" id="filter-results"></div>
      </div>
      ${bottomNav("home")}
    `;
  }

  function filterPlaces(q, maxPrice, catId) {
    const ql = (q || "").toLowerCase();
    return catalog.places.filter((p) => {
      const matchText =
        !ql ||
        p.name.toLowerCase().includes(ql) ||
        p.country.toLowerCase().includes(ql) ||
        p.blurb.toLowerCase().includes(ql);
      const matchPrice = p.priceFrom <= maxPrice;
      const matchCat = !catId || p.categoryId === catId;
      return matchText && matchPrice && matchCat;
    });
  }

  function ScreenPlanTrip() {
    const params = new URLSearchParams(location.hash.split("?")[1] || "");
    const presetDest = params.get("dest") || "";
    const today = new Date().toISOString().slice(0, 10);
    const nextWeek = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Trip planning</h1>
        </div>
        <div class="filter-block">
          <form id="form-plan">
            <div class="field">
              <label for="plan-dest">Select destination</label>
              <select id="plan-dest" required>
                ${catalog.places
                  .map(
                    (p) =>
                      `<option value="${p.id}" ${p.id === presetDest ? "selected" : ""}>${escapeHtml(p.name)}, ${escapeHtml(p.country)}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div class="row-2">
              <div class="field">
                <label for="plan-start">Start date</label>
                <input type="date" id="plan-start" value="${today}" required />
              </div>
              <div class="field">
                <label for="plan-end">End date</label>
                <input type="date" id="plan-end" value="${nextWeek}" required />
              </div>
            </div>
            <div class="field">
              <label for="plan-people">Number of people</label>
              <input type="number" id="plan-people" min="1" max="20" value="2" required />
            </div>
            <div class="field">
              <label for="plan-budget">Budget range ($ total)</label>
              <input type="range" id="plan-budget" min="500" max="8000" step="100" value="3000" />
              <div id="plan-budget-label" style="font-size:0.85rem;color:var(--muted);margin-top:6px">$3000</div>
            </div>
            <div class="field">
              <label for="plan-name">Trip name</label>
              <input id="plan-name" placeholder="e.g. Kyoto spring" required />
            </div>
            <button type="submit" class="btn btn-primary">Save trip</button>
          </form>
        </div>
        <button type="button" class="btn btn-outline" id="btn-more-act">Add more activities</button>
        <p style="font-size:0.82rem;color:var(--muted);text-align:center;margin-top:10px">Opens search — add bookings from each destination.</p>
      </div>
      ${bottomNav("trips")}
    `;
  }

  function ScreenTripsList() {
    const trips = getTrips();
    const tab = window.__tripsTab || "ongoing";
    const grouped = { ongoing: [], upcoming: [], completed: [] };
    trips.forEach((t) => grouped[tripStatus(t)].push(t));

    function rows(list) {
      if (list.length === 0) return `<p class="empty-hint">No trips here yet.</p>`;
      return list
        .map((t) => {
          const place = catalog.places.find((p) => p.id === t.destinationId);
          const img = place ? place.image : "";
          return `
          <button type="button" class="trip-row" data-go="/trip/${t.id}">
            <img class="thumb" src="${img}" alt="" />
            <div class="body">
              <h3>${escapeHtml(t.name)}</h3>
              <p>${place ? escapeHtml(place.name) : ""} · ${t.startDate} → ${t.endDate}</p>
              <p>${escapeHtml(t.overview || "Tap to view itinerary and daily costs.")}</p>
            </div>
            <span class="status-badge">${tripStatus(t)}</span>
          </button>`;
        })
        .join("");
    }

    return `
      <div class="screen">
        <div class="top-bar">
          <h1>My trips</h1>
          <button type="button" class="btn-icon" data-go="/plan-trip" aria-label="New trip">＋</button>
        </div>
        <div class="tabs" id="trip-tabs">
          <button type="button" class="tab ${tab === "ongoing" ? "active" : ""}" data-tab="ongoing">Ongoing</button>
          <button type="button" class="tab ${tab === "upcoming" ? "active" : ""}" data-tab="upcoming">Upcoming</button>
          <button type="button" class="tab ${tab === "completed" ? "active" : ""}" data-tab="completed">Completed</button>
        </div>
        <div id="trip-panel-ongoing" style="display:${tab === "ongoing" ? "block" : "none"}">${rows(grouped.ongoing)}</div>
        <div id="trip-panel-upcoming" style="display:${tab === "upcoming" ? "block" : "none"}">${rows(grouped.upcoming)}</div>
        <div id="trip-panel-completed" style="display:${tab === "completed" ? "block" : "none"}">${rows(grouped.completed)}</div>
      </div>
      ${bottomNav("trips")}
    `;
  }

  function ScreenTripItinerary(tripId) {
    const trip = getTrips().find((t) => t.id === tripId);
    if (!trip) {
      return `<div class="screen"><p class="empty-hint">Trip not found.</p><button class="btn btn-primary" data-go="/trips">Back</button></div>${bottomNav("trips")}`;
    }
    const bookings = getBookings().filter((b) => b.tripId === tripId);
    const place = catalog.places.find((p) => p.id === trip.destinationId);
    const numDays = Math.max(3, Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 864e5) + 1);

    const days = [];
    for (let d = 0; d < Math.min(numDays, 7); d++) {
      const dayBookings = bookings
        .filter((b) => b.dayIndex === d)
        .sort((a, b) => a.time.localeCompare(b.time));
      let dayTotal = dayBookings.reduce((s, b) => s + b.price, 0);
      const slotsHtml =
        dayBookings.length === 0
          ? `<p style="color:var(--muted);font-size:0.88rem;margin:0">No activities yet — add from Activities.</p>`
          : dayBookings
              .map(
                (b) => `
        <div class="slot-row">
          <span class="time">${escapeHtml(b.time)}</span>
          <span style="flex:1;padding:0 10px">${escapeHtml(b.title)}</span>
          <span>$${b.price}</span>
        </div>`
              )
              .join("");
      days.push(`
        <div class="day-card">
          <h3>Day ${d + 1}</h3>
          ${slotsHtml}
          <div class="day-total"><span>Daily subtotal</span><span>$${dayTotal}</span></div>
        </div>
      `);
    }

    const overview = trip.overview || "Short overview: experiences, meals, and transport for this leg.";

    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Itinerary</h1>
          <button type="button" class="btn-icon" data-go="/budget?trip=${tripId}" aria-label="Budget">📊</button>
        </div>
        <p style="margin:0 0 8px;font-weight:600">${escapeHtml(trip.name)}</p>
        <p style="margin:0 0 14px;color:var(--muted);font-size:0.9rem">
          ${place ? escapeHtml(place.name) : ""} · ${trip.startDate} → ${trip.endDate} · ${trip.people} people
        </p>
        <div class="filter-block" style="margin-bottom:14px">
          <label class="field" style="margin:0">
            <span style="font-size:0.78rem;font-weight:600;color:var(--muted)">Trip overview</span>
            <textarea id="trip-overview" style="margin-top:8px;min-height:72px">${escapeHtml(overview)}</textarea>
          </label>
        </div>
        ${days.join("")}
        <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
          <button type="button" class="btn btn-secondary" data-go="/activity-list/${trip.destinationId}">Add activities</button>
          <button type="button" class="btn btn-primary" data-go="/trip-summary/${tripId}">Summary & checkout</button>
        </div>
      </div>
      ${bottomNav("trips")}
    `;
  }

  function ScreenActivityList(placeId) {
    const place = catalog.places.find((p) => p.id === placeId);
    if (!place) return `<div class="screen"><p>Not found</p></div>${bottomNav("home")}`;
    const acts = catalog.activities[placeId] || [];
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>${escapeHtml(place.name)}</h1>
        </div>
        ${acts
          .map(
            (a) => `
        <button type="button" class="trip-row" style="align-items:center" data-go="/activity/${placeId}/${a.id}">
          <img class="thumb" src="${a.image || place.image}" alt="" style="width:72px;height:72px;border-radius:12px" />
          <div class="body">
            <h3>${escapeHtml(a.title)}</h3>
            <p>${escapeHtml(a.description)}</p>
            <p style="font-weight:700;color:var(--accent);margin-top:6px">$${a.price}</p>
          </div>
          <span class="status-badge">View</span>
        </button>`
          )
          .join("")}
      </div>
      ${bottomNav("home")}
    `;
  }

  function ScreenActivityDetail(placeId, activityId) {
    const place = catalog.places.find((p) => p.id === placeId);
    const act = (catalog.activities[placeId] || []).find((a) => a.id === activityId);
    if (!place || !act) return `<div class="screen"><p>Not found</p></div>${bottomNav("home")}`;
    const reviews = catalog.reviews.template;
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Activity</h1>
        </div>
        <div class="activity-hero">
          <img src="${act.image || place.image}" alt="" loading="lazy" />
          <h2 style="font-family:var(--font-display);margin:0 0 8px">${escapeHtml(act.title)}</h2>
          <p style="color:var(--muted);margin:0 0 12px">${escapeHtml(act.description)}</p>
          <p style="font-size:1.35rem;font-weight:700;color:var(--accent);margin:0">$${act.price}</p>
        </div>
        <button type="button" class="btn btn-primary" data-go="/booking/${placeId}/${activityId}">Book now</button>
        <h2 class="section-title" style="margin-top:20px">Reviews</h2>
        ${reviews
          .map(
            (r) => `
        <div class="review-card">
          <div class="stars" aria-hidden="true">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
          <strong>${escapeHtml(r.user)}</strong>
          <p style="margin:6px 0 0;color:var(--muted)">${escapeHtml(r.text)}</p>
        </div>`
          )
          .join("")}
      </div>
      ${bottomNav("home")}
    `;
  }

  function ScreenBooking(placeId, activityId) {
    const place = catalog.places.find((p) => p.id === placeId);
    const act = (catalog.activities[placeId] || []).find((a) => a.id === activityId);
    if (!place || !act) return `<div class="screen"><p>Not found</p></div>${bottomNav("home")}`;
    const trips = getTrips().filter((t) => t.destinationId === placeId);
    const allTrips = getTrips();
    const tripOptions = trips.length ? trips : allTrips;
    const today = new Date().toISOString().slice(0, 10);
    if (tripOptions.length === 0) {
      return `
      <div class="screen">
        <div class="top-bar"><button type="button" class="btn-icon" data-back>←</button><h1>Book</h1></div>
        <p class="empty-hint">Create a trip that includes this destination first.</p>
        <button class="btn btn-primary" data-go="/plan-trip?dest=${placeId}">Plan trip</button>
      </div>${bottomNav("home")}`;
    }
    const cat = catalog.categories.find((c) => c.id === place.categoryId);
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Booking</h1>
        </div>
        <div class="filter-block">
          <p style="margin:0 0 4px;color:var(--muted);font-size:0.85rem">${escapeHtml(place.name)}</p>
          <h2 style="margin:0;font-family:var(--font-display)">${escapeHtml(act.title)}</h2>
          <p style="font-size:1.2rem;font-weight:700;color:var(--accent);margin:12px 0 0">$${act.price}</p>
          <form id="form-booking" style="margin-top:16px">
            <div class="field">
              <label for="b-trip">Trip</label>
              <select id="b-trip" name="tripId" required>
                ${tripOptions.map((t) => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label for="b-day">Schedule on day</label>
              <select id="b-day" name="dayIndex">
                <option value="0">Day 1</option>
                <option value="1">Day 2</option>
                <option value="2">Day 3</option>
              </select>
            </div>
            <div class="field">
              <label for="b-date">Date</label>
              <input type="date" id="b-date" name="date" value="${today}" required />
            </div>
            <div class="field">
              <label for="b-time">Time</label>
              <input type="time" id="b-time" name="time" value="10:00" required />
            </div>
            <div class="field">
              <label for="b-cat">Expense category</label>
              <select id="b-cat" name="expenseCategory">
                <option>Activities</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Accommodation</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Confirm booking</button>
          </form>
        </div>
      </div>
      ${bottomNav("home")}
    `;
  }

  function ScreenTripSummary(tripId) {
    const trip = getTrips().find((t) => t.id === tripId);
    if (!trip) return `<div class="screen"><p>Not found</p></div>${bottomNav("trips")}`;
    const lines = getBookings().filter((b) => b.tripId === tripId);
    const total = tripSpent(tripId);
    const tax = Math.round(total * 0.08);
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Trip summary</h1>
        </div>
        <h2 style="font-family:var(--font-display);margin:0 0 12px">${escapeHtml(trip.name)}</h2>
        <div class="filter-block">
          ${lines.length === 0 ? `<p class="empty-hint" style="padding:0">No bookings yet.</p>` : ""}
          ${lines.map((l) => `<div class="receipt-row"><span>${escapeHtml(l.title)}</span><span>$${l.price}</span></div>`).join("")}
          <div class="receipt-row"><span>Taxes (est.)</span><span>$${tax}</span></div>
          <div class="receipt-row total"><span>Total</span><span>$${total + tax}</span></div>
        </div>
        <button type="button" class="btn btn-coral" data-go="/payment/${tripId}">Payment summary</button>
      </div>
      ${bottomNav("trips")}
    `;
  }

  function ScreenPayment(tripId) {
    const trip = getTrips().find((t) => t.id === tripId);
    if (!trip) return `<div class="screen"><p>Not found</p></div>${bottomNav("trips")}`;
    const lines = getBookings().filter((b) => b.tripId === tripId);
    const subtotal = tripSpent(tripId);
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;
    const orderId = tripId.slice(0, 8).toUpperCase();
    const hotel = Math.round(trip.budget * 0.35);
    const flight = Math.round(trip.budget * 0.28);
    const activitiesSum = subtotal;
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Payment</h1>
        </div>
        <div class="filter-block">
          <div class="receipt-row"><span>Order ID</span><span>#${orderId}</span></div>
          <div class="receipt-row"><span>Date</span><span>${new Date().toLocaleDateString()}</span></div>
        </div>
        <h2 class="section-title">Costs</h2>
        <div class="filter-block">
          <div class="receipt-row"><span>Hotel (est.)</span><span>$${hotel}</span></div>
          <div class="receipt-row"><span>Flight (est.)</span><span>$${flight}</span></div>
          <div class="receipt-row"><span>Activities (booked)</span><span>$${activitiesSum}</span></div>
          <div class="receipt-row"><span>Taxes</span><span>$${tax}</span></div>
          <div class="receipt-row total"><span>Total amount</span><span>$${hotel + flight + activitiesSum + tax}</span></div>
        </div>
        <div class="filter-block">
          <p style="margin:0;font-size:0.9rem;color:var(--muted)"><strong>Payment method</strong></p>
          <p style="margin:8px 0 0">Visa ending 4242 (demo)</p>
        </div>
        <button type="button" class="btn btn-primary" id="btn-paid">Mark as paid (demo)</button>
      </div>
      ${bottomNav("trips")}
    `;
  }

  function ScreenBudget() {
    const params = new URLSearchParams(location.hash.split("?")[1] || "");
    const focusTripId = params.get("trip");
    const trips = getTrips();
    const trip = focusTripId ? trips.find((t) => t.id === focusTripId) : trips[0];
    if (!trip) {
      return `
      <div class="screen">
        <div class="top-bar"><button type="button" class="btn-icon" data-back>←</button><h1>Budget</h1></div>
        <p class="empty-hint">Add a trip to track budget.</p>
        <button class="btn btn-primary" data-go="/plan-trip">Plan trip</button>
      </div>${bottomNav("profile")}`;
    }
    const budget = trip.budget;
    const spent = tripSpent(trip.id);
    const remaining = Math.max(0, budget - spent);
    const cats = categorySpendForTrip(trip.id);
    const catRows = Object.keys(cats).length
      ? Object.entries(cats)
          .map(([k, v]) => `<div class="receipt-row"><span>${escapeHtml(k)}</span><span>$${v}</span></div>`)
          .join("")
      : `<div class="receipt-row"><span>Activities</span><span>$${spent}</span></div>`;

    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Budget tracker</h1>
        </div>
        <div class="budget-hero">
          <div style="font-size:0.85rem;opacity:0.9">${escapeHtml(trip.name)}</div>
          <div style="margin-top:8px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
            <div><div style="opacity:0.85;font-size:0.8rem">Total budget</div><div class="big">$${budget}</div></div>
            <div><div style="opacity:0.85;font-size:0.8rem">Spent</div><div class="big">$${spent}</div></div>
            <div><div style="opacity:0.85;font-size:0.8rem">Remaining</div><div class="big">$${remaining}</div></div>
          </div>
        </div>
        <div class="filter-block budget-rows">
          <h3 style="margin:0 0 10px;font-size:0.9rem;color:var(--muted)">By category</h3>
          ${catRows}
        </div>
        <button type="button" class="btn btn-secondary" data-go="/analytics">Open analytics</button>
      </div>
      ${bottomNav("profile")}
    `;
  }

  function ScreenAnalytics() {
    const bookings = getBookings();
    const total = bookings.reduce((s, b) => s + b.price, 0);
    const trips = getTrips().length;
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-go="/profile" aria-label="Close">←</button>
          <h1>Dashboard</h1>
        </div>
        <p style="margin:0 0 14px;color:var(--muted);font-size:0.92rem">Visual overview of spend and trip cadence.</p>
        <div class="analytics-grid">
          <div class="chart-card">
            <h3>Spend split</h3>
            <div class="pie-visual" aria-hidden="true"></div>
            <p style="text-align:center;font-size:0.8rem;color:var(--muted);margin:8px 0 0">Activities · Stay · Food</p>
          </div>
          <div class="chart-card">
            <h3>Trips</h3>
            <p style="font-size:2rem;font-weight:700;margin:12px 0 4px;font-family:var(--font-display)">${trips}</p>
            <p style="margin:0;font-size:0.85rem;color:var(--muted)">Bookings: ${bookings.length}</p>
          </div>
        </div>
        <div class="chart-card" style="margin-bottom:12px">
          <h3>Trend</h3>
          <div class="line-chart"></div>
        </div>
        <div class="chart-card">
          <h3>Monthly comparison</h3>
          <div class="bar-chart">
            <div class="bar" style="height:45%"></div>
            <div class="bar" style="height:70%"></div>
            <div class="bar" style="height:55%"></div>
            <div class="bar" style="height:90%"></div>
            <div class="bar" style="height:60%"></div>
          </div>
        </div>
        <div class="filter-block" style="margin-top:14px">
          <div class="receipt-row"><span>Recorded activity spend</span><span>$${total}</span></div>
        </div>
        <button type="button" class="btn btn-primary" data-go="/budget">Budget details</button>
      </div>
      ${bottomNav("profile")}
    `;
  }

  function ScreenNotifications() {
    const items = [
      { t: "Trip reminder", b: "Kyoto trip starts in 3 days — review itinerary.", unread: true },
      { t: "Community", b: "Jordan Lee commented on your saved place.", unread: true },
      { t: "Price alert", b: "Flights to Lisbon dropped on your dates.", unread: false },
    ];
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Notifications</h1>
        </div>
        ${items
          .map(
            (n) => `
        <div class="notif-row">
          ${n.unread ? `<span class="dot" aria-hidden="true"></span>` : `<span style="width:10px;flex-shrink:0"></span>`}
          <div>
            <strong>${escapeHtml(n.t)}</strong>
            <p style="margin:6px 0 0;color:var(--muted);font-size:0.9rem">${escapeHtml(n.b)}</p>
          </div>
        </div>`
          )
          .join("")}
      </div>
      ${bottomNav("home")}
    `;
  }

  function ScreenSettings() {
    const s = getSettings();
    return `
      <div class="screen">
        <div class="top-bar">
          <button type="button" class="btn-icon" data-back aria-label="Back">←</button>
          <h1>Settings</h1>
        </div>
        <div class="filter-block">
          <div class="settings-row"><span>Account</span><button type="button" class="btn-icon" style="width:auto;padding:8px 12px;font-size:0.85rem" data-go="/profile">Edit</button></div>
          <div class="settings-row"><span>Privacy</span><span style="color:var(--muted);font-size:0.88rem">Standard</span></div>
          <div class="settings-row">
            <span>Push notifications</span>
            <button type="button" class="switch ${s.notifPush ? "on" : ""}" id="sw-push" aria-pressed="${s.notifPush}"></button>
          </div>
          <div class="settings-row">
            <span>Email updates</span>
            <button type="button" class="switch ${s.notifEmail ? "on" : ""}" id="sw-email" aria-pressed="${s.notifEmail}"></button>
          </div>
          <div class="settings-row"><span>Language</span><span>${escapeHtml(s.lang)}</span></div>
          <div class="settings-row"><span>Help & support</span><span style="color:var(--muted)">traveloop.help</span></div>
        </div>
      </div>
      ${bottomNav("profile")}
    `;
  }

  function ScreenProfile() {
    const u = getUser();
    const trips = getTrips();
    return `
      <div class="screen">
        <div class="top-bar">
          <h1>Profile</h1>
          <button type="button" class="btn-icon" data-go="/settings" aria-label="Settings">⚙</button>
        </div>
        <div class="profile-header">
          <img class="avatar" src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&q=80" alt="" />
          <h2>${escapeHtml(u.displayName || u.firstName || "Traveler")}</h2>
          <p class="bio">${escapeHtml(u.city && u.country ? u.city + ", " + u.country : "Explorer · Traveloop")}</p>
          <button type="button" class="btn btn-outline" style="margin-top:12px;padding:10px 18px;width:auto;display:inline-flex">Edit profile</button>
        </div>
        <div class="filter-block">
          <h3 style="margin:0 0 10px;font-size:0.9rem;color:var(--muted)">Personal info</h3>
          <p style="margin:0;font-size:0.92rem">${escapeHtml(u.email || "")}</p>
        </div>
        <h2 class="section-title">My trips</h2>
        ${
          trips.length === 0
            ? `<p class="empty-hint">No trips yet.</p>`
            : trips
                .slice(0, 4)
                .map(
                  (t) => `
            <button type="button" class="trip-row" data-go="/trip/${t.id}">
              <div class="body"><h3>${escapeHtml(t.name)}</h3><p>${t.startDate} · Budget $${t.budget}</p></div>
              <span class="status-badge">${tripStatus(t)}</span>
            </button>`
                )
                .join("")
        }
        <button type="button" class="btn btn-secondary" style="margin-top:8px" data-go="/trips">All trips</button>
        <h2 class="section-title" style="margin-top:18px">Shortcuts</h2>
        <div class="category-grid">
          <button type="button" class="pill" data-go="/budget">Budget tracker</button>
          <button type="button" class="pill" data-go="/analytics">Analytics</button>
          <button type="button" class="pill" data-go="/community">Community</button>
        </div>
        <button type="button" class="btn btn-secondary" style="margin-top:16px" id="btn-logout">Log out</button>
      </div>
      ${bottomNav("profile")}
    `;
  }

  function ScreenCommunity() {
    const posts = catalog.feedPosts || [];
    const liked = loadJson("traveloop_liked", {});
    return `
      <div class="screen">
        <div class="top-bar">
          <h1>Community</h1>
        </div>
        <div class="search-bar">
          <span>🔍</span>
          <input type="search" id="feed-q" placeholder="Search posts…" />
        </div>
        <div id="feed-list">
          ${posts
            .map((p) => {
              const likes = liked[p.id] != null ? liked[p.id] : p.likes;
              return `
            <div class="feed-post" data-q="${p.author.toLowerCase()} ${p.text.toLowerCase()}">
              <div class="feed-head">
                <img src="${p.avatar}" alt="" />
                <div class="meta">
                  <h3>${escapeHtml(p.author)}</h3>
                  <span>${escapeHtml(p.time)}</span>
                </div>
              </div>
              <p style="margin:0;font-size:0.95rem">${escapeHtml(p.text)}</p>
              <div class="feed-actions">
                <button type="button" data-like="${p.id}">♥ Like · ${likes}</button>
                <button type="button">💬 Comment · ${p.comments}</button>
              </div>
            </div>`;
            })
            .join("")}
        </div>
      </div>
      ${bottomNav("community")}
    `;
  }

  /* ---------- Wire handlers ---------- */

  function wireLogin() {
    document.getElementById("form-login")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      if (!username) return;
      setUser({ username, displayName: username, email: `${username}@demo.local` });
      toast("Signed in");
      navigate("/home");
    });
  }

  function wireRegister() {
    document.getElementById("form-register")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = {
        firstName: document.getElementById("fn").value.trim(),
        lastName: document.getElementById("ln").value.trim(),
        displayName: `${document.getElementById("fn").value.trim()} ${document.getElementById("ln").value.trim()}`.trim(),
        email: document.getElementById("em").value.trim(),
        phone: document.getElementById("ph").value.trim(),
        city: document.getElementById("city").value.trim(),
        country: document.getElementById("country").value.trim(),
        username: document.getElementById("em").value.trim(),
      };
      setUser(u);
      toast("Welcome!");
      navigate("/home");
    });
  }

  function wireHome() {
    document.getElementById("home-cats")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      document.querySelectorAll("#home-cats button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      navigate(`/search?cat=${encodeURIComponent(btn.getAttribute("data-cat"))}`);
    });
  }

  function wireSearch() {
    const params = new URLSearchParams(location.hash.split("?")[1] || "");
    const presetCat = params.get("cat") || "";
    const qEl = document.getElementById("filter-q");
    const priceEl = document.getElementById("price");
    const priceLabel = document.getElementById("price-label");
    const catBtns = document.querySelectorAll("#filter-cats .pill");
    let catId = presetCat;

    catBtns.forEach((btn) => {
      if ((btn.getAttribute("data-cat") || "") === catId) {
        catBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      }
      btn.addEventListener("click", () => {
        catBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        catId = btn.getAttribute("data-cat") || "";
        renderResults();
      });
    });

    function renderResults() {
      const maxPrice = Number(priceEl.value);
      priceLabel.textContent = `Up to $${maxPrice}`;
      const list = filterPlaces(qEl.value, maxPrice, catId);
      const host = document.getElementById("filter-results");
      host.innerHTML = list
        .map(
          (p) => `
        <button type="button" class="place-card" data-place="${p.id}">
          <img src="${p.image}" alt="" loading="lazy" />
          <div class="meta"><h3>${p.name}</h3><p class="price">From $${p.priceFrom}</p></div>
        </button>`
        )
        .join("");
      host.querySelectorAll("[data-place]").forEach((c) => {
        c.addEventListener("click", () => navigate(`/destination/${c.getAttribute("data-place")}`));
      });
    }

    qEl.addEventListener("input", renderResults);
    priceEl.addEventListener("input", renderResults);
    renderResults();
  }

  function wirePlanTrip() {
    const budget = document.getElementById("plan-budget");
    const label = document.getElementById("plan-budget-label");
    budget?.addEventListener("input", () => {
      label.textContent = `$${budget.value}`;
    });
    document.getElementById("form-plan")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const dest = document.getElementById("plan-dest").value;
      const trip = {
        id: uid(),
        name: document.getElementById("plan-name").value.trim(),
        destinationId: dest,
        startDate: document.getElementById("plan-start").value,
        endDate: document.getElementById("plan-end").value,
        people: Number(document.getElementById("plan-people").value),
        budget: Number(document.getElementById("plan-budget").value),
        overview: "",
        createdAt: new Date().toISOString(),
      };
      const trips = getTrips();
      trips.unshift(trip);
      saveTrips(trips);
      toast("Trip saved");
      navigate(`/trip/${trip.id}`);
    });
    document.getElementById("btn-more-act")?.addEventListener("click", () => navigate("/search"));
  }

  function wireTripsList() {
    document.getElementById("trip-tabs")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tab]");
      if (!btn) return;
      const tab = btn.getAttribute("data-tab");
      window.__tripsTab = tab;
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      ["ongoing", "upcoming", "completed"].forEach((name) => {
        const panel = document.getElementById(`trip-panel-${name}`);
        if (panel) panel.style.display = name === tab ? "block" : "none";
      });
    });
  }

  function wireTripItinerary(tripId) {
    document.getElementById("trip-overview")?.addEventListener("change", (e) => {
      const trips = getTrips();
      const t = trips.find((x) => x.id === tripId);
      if (t) {
        t.overview = e.target.value;
        saveTrips(trips);
      }
    });
  }

  function wireBooking(placeId, activityId) {
    const form = document.getElementById("form-booking");
    if (!form) return;
    const place = catalog.places.find((p) => p.id === placeId);
    const act = (catalog.activities[placeId] || []).find((a) => a.id === activityId);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const booking = {
        id: uid(),
        tripId: fd.get("tripId"),
        placeId,
        activityId,
        title: act.title,
        placeName: place.name,
        date: fd.get("date"),
        time: fd.get("time"),
        price: act.price,
        status: "confirmed",
        dayIndex: Number(fd.get("dayIndex")),
        expenseCategory: fd.get("expenseCategory") || "Activities",
      };
      const all = getBookings();
      all.push(booking);
      saveBookings(all);
      toast("Booking added to itinerary");
      navigate(`/trip/${booking.tripId}`);
    });
  }

  function wirePayment(tripId) {
    document.getElementById("btn-paid")?.addEventListener("click", () => {
      toast("Payment recorded (demo)");
      navigate("/trips");
    });
  }

  function wireSettings() {
    const s = getSettings();
    const push = document.getElementById("sw-push");
    const email = document.getElementById("sw-email");
    push?.addEventListener("click", () => {
      s.notifPush = !s.notifPush;
      saveSettings(s);
      push.classList.toggle("on", s.notifPush);
      push.setAttribute("aria-pressed", s.notifPush);
    });
    email?.addEventListener("click", () => {
      s.notifEmail = !s.notifEmail;
      saveSettings(s);
      email.classList.toggle("on", s.notifEmail);
      email.setAttribute("aria-pressed", s.notifEmail);
    });
  }

  function wireProfile() {
    document.getElementById("btn-logout")?.addEventListener("click", () => {
      setUser(null);
      navigate("/login");
    });
  }

  function wireCommunity() {
    const liked = loadJson("traveloop_liked", {});
    document.getElementById("feed-q")?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll(".feed-post").forEach((post) => {
        const hay = post.getAttribute("data-q") || "";
        post.style.display = hay.includes(q) ? "" : "none";
      });
    });
    document.querySelectorAll("[data-like]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-like");
        const post = catalog.feedPosts.find((p) => p.id === id);
        const base = post ? post.likes : 0;
        liked[id] = (liked[id] != null ? liked[id] : base) + 1;
        saveJson("traveloop_liked", liked);
        btn.textContent = `♥ Like · ${liked[id]}`;
        toast("Thanks!");
      });
    });
  }

  async function render() {
    await fetchCatalog();
    const { name, parts } = parseRoute();
    if (!requireAuth(name)) return;

    const app = document.getElementById("app");
    let html = "";
    let wire = () => {};

    switch (name) {
      case "login":
        html = ScreenLogin();
        wire = wireLogin;
        break;
      case "register":
        html = ScreenRegister();
        wire = wireRegister;
        break;
      case "home":
        html = ScreenHome();
        wire = wireHome;
        break;
      case "destination": {
        html = ScreenDestination(parts[1]);
        wire = () => {};
        break;
      }
      case "search":
        html = ScreenSearch();
        wire = wireSearch;
        break;
      case "plan-trip":
        html = ScreenPlanTrip();
        wire = wirePlanTrip;
        break;
      case "trips":
        html = ScreenTripsList();
        wire = wireTripsList;
        break;
      case "trip": {
        html = ScreenTripItinerary(parts[1]);
        wire = () => wireTripItinerary(parts[1]);
        break;
      }
      case "activity-list": {
        html = ScreenActivityList(parts[1]);
        wire = () => {};
        break;
      }
      case "activity": {
        html = ScreenActivityDetail(parts[1], parts[2]);
        wire = () => {};
        break;
      }
      case "booking": {
        html = ScreenBooking(parts[1], parts[2]);
        wire = () => wireBooking(parts[1], parts[2]);
        break;
      }
      case "trip-summary": {
        html = ScreenTripSummary(parts[1]);
        wire = () => {};
        break;
      }
      case "payment": {
        html = ScreenPayment(parts[1]);
        wire = () => wirePayment(parts[1]);
        break;
      }
      case "budget":
        html = ScreenBudget();
        wire = () => {};
        break;
      case "analytics":
        html = ScreenAnalytics();
        wire = () => {};
        break;
      case "notifications":
        html = ScreenNotifications();
        wire = () => {};
        break;
      case "settings":
        html = ScreenSettings();
        wire = wireSettings;
        break;
      case "profile":
        html = ScreenProfile();
        wire = wireProfile;
        break;
      case "community":
        html = ScreenCommunity();
        wire = wireCommunity;
        break;
      default:
        navigate("/home");
        return;
    }

    app.innerHTML = html;
    attachNavHandlers();
    bindGlobalClicks();
    wire();
  }

  window.addEventListener("hashchange", () => render().catch(console.error));
  render().catch(console.error);
})();
