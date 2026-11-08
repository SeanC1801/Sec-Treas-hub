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
// the draft's main profile: a stand-in name, so test printouts never carry a real officer's name
export const TEST_OFFICER = "Test Officer";
// one-time move: the old default profile (a real officer) becomes Test Officer
try { const s = getSession(), F = "sectreas:testofficer:v1"; if (!localStorage.getItem(F)) { if (s && s.name === "Alexis Yumi M. Suzuki") setSession({ role: "treasurer", name: TEST_OFFICER }); localStorage.setItem(F, "1"); } } catch {}
export const me = () => getSession() || { name: "Treasurer", role: "treasurer" };
