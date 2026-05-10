const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "..", "public");
const travelDataPath = path.join(__dirname, "data", "travel-data.json");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

let travelDataCache;
function loadTravelData() {
  if (!travelDataCache) {
    travelDataCache = JSON.parse(fs.readFileSync(travelDataPath, "utf8"));
  }
  return travelDataCache;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendJson(res, obj, status = 200) {
  send(res, status, JSON.stringify(obj), { "Content-Type": "application/json; charset=utf-8" });
}

function safeJoin(base, reqPath) {
  const decoded = decodeURIComponent(reqPath.split("?")[0]);
  const target = path.normalize(path.join(base, decoded));
  if (!target.startsWith(path.normalize(base))) return null;
  return target;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === "/api/data" && req.method === "GET") {
    return sendJson(res, loadTravelData());
  }

  const placeMatch = pathname.match(/^\/api\/places\/([^/]+)$/);
  if (placeMatch && req.method === "GET") {
    const id = placeMatch[1];
    const data = loadTravelData();
    const place = data.places.find((p) => p.id === id);
    if (!place) return sendJson(res, { error: "Place not found" }, 404);
    const activities = data.activities[place.id] || [];
    return sendJson(res, { place, activities });
  }

  let filePath = safeJoin(publicDir, pathname === "/" ? "/index.html" : pathname);
  if (!filePath) return send(res, 403, "Forbidden");

  fs.stat(filePath, (err, st) => {
    if (!err && st.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const type = MIME[ext] || "application/octet-stream";
      fs.readFile(filePath, (e, buf) => {
        if (e) return send(res, 500, "Server error");
        send(res, 200, buf, { "Content-Type": type, "Cache-Control": "public, max-age=3600" });
      });
      return;
    }

    const indexHtml = path.join(publicDir, "index.html");
    fs.readFile(indexHtml, (e, buf) => {
      if (e) return send(res, 404, "Not found");
      send(res, 200, buf, { "Content-Type": "text/html; charset=utf-8" });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Traveloop running at http://localhost:${PORT}`);
});
