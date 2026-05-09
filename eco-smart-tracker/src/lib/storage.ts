// ============================================================
// LocalStorage Utility — All data persistence for the app
// ============================================================

export interface User {
  username: string;
  password: string;
}

export interface DetectionResult {
  id: string;
  timestamp: string;
  wasteType: "Wet" | "Dry" | "Hazardous";
  confidence: number;
  points: number;
}

export interface UserSession {
  username: string;
  loggedInAt: string;
}

// --- Keys ---
const USERS_KEY = "swm_users";
const SESSION_KEY = "swm_session";
const DETECTIONS_KEY = "swm_detections";
const POINTS_KEY = "swm_points";

// --- Users ---
export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

export function registerUser(username: string, password: string): boolean {
  const users = getUsers();
  if (users.find((u) => u.username === username)) return false;
  users.push({ username, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
}

export function loginUser(username: string, password: string): boolean {
  const users = getUsers();
  const found = users.find((u) => u.username === username && u.password === password);
  if (!found) return false;
  const session: UserSession = { username, loggedInAt: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return true;
}

export function getSession(): UserSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

// --- Detections ---
export function getDetections(): DetectionResult[] {
  return JSON.parse(localStorage.getItem(DETECTIONS_KEY) || "[]");
}

export function addDetection(result: DetectionResult): void {
  const detections = getDetections();
  detections.unshift(result);
  localStorage.setItem(DETECTIONS_KEY, JSON.stringify(detections));
  // Add points
  const currentPoints = getPoints();
  localStorage.setItem(POINTS_KEY, String(currentPoints + result.points));
}

export function clearDetections(): void {
  localStorage.removeItem(DETECTIONS_KEY);
  localStorage.removeItem(POINTS_KEY);
}

// --- Points ---
export function getPoints(): number {
  return parseInt(localStorage.getItem(POINTS_KEY) || "0", 10);
}

// --- Badge ---
export function getBadge(points: number): { name: string; emoji: string; next: number; min: number } {
  if (points > 200) return { name: "Eco Master", emoji: "🏆", next: Infinity, min: 201 };
  if (points > 50) return { name: "Eco Hero", emoji: "🌟", next: 201, min: 51 };
  return { name: "Eco Beginner", emoji: "🌱", next: 51, min: 0 };
}

// --- Admin: reset all ---
export function resetAllData(): void {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(DETECTIONS_KEY);
  localStorage.removeItem(POINTS_KEY);
}
