// Who is signed in. Front-end draft only: the real Google sign-in comes with the backend.
const KEY = "sectreas:session:v1";
export const ROLES = {
  treasurer: "Treasurer",
  president: "President",
  adviser: "Adviser",
  secretary: "Secretary",
};
export function getSession() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function setSession(s) {
  try { s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY); } catch {}
}
export const me = () => getSession() || { name: "Treasurer", role: "treasurer" };
