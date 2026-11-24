// Reads the harness task files. Shared by progress.mjs and check-harness.mjs.

export function parseStatus(raw) {
  const s = (raw || "").trim().toLowerCase();
  const date = (s.match(/(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
  if (s.startsWith("verified")) return { key: "verified", rank: 4, date, label: "Verified" };
  if (s.startsWith("submitted")) return { key: "submitted", rank: 3, date, label: "Submitted" };
  if (s.startsWith("returned")) return { key: "returned", rank: 1, date, label: "Returned", reason: (raw.split(":").slice(1).join(":") || "").trim() };
  if (s.startsWith("in progress")) return { key: "progress", rank: 1, date: null, label: "In progress" };
  return { key: "none", rank: 0, date: null, label: "Not started" };
}

export function parseTaskFile(text) {
  const planLine = (text.match(/^Deadline plan:\s*(.*)$/m) || [, ""])[1];
  const plan = /^A\b/.test(planLine) ? "A" : /^B\b/.test(planLine) ? "B" : null;
  const tasks = new Map();
  const heads = [...text.matchAll(/^## ([TS]\d+)\. (.+)$/gm)];
  heads.forEach((h, i) => {
    const body = text.slice(h.index, i + 1 < heads.length ? heads[i + 1].index : text.length).split(/^## (?![TS]\d)/m)[0];
    const line = (k) => (body.match(new RegExp(`^- ${k}:\\s*(.*)$`, "m")) || [, ""])[1].trim();
    const dueRaw = line("Due");
    tasks.set(h[1], {
      id: h[1], title: h[2].trim(),
      due: (dueRaw.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || null,
      planDates: { A: (dueRaw.match(/Plan A:\s*(\d{4}-\d{2}-\d{2})/) || [])[1], B: (dueRaw.match(/Plan B:\s*(\d{4}-\d{2}-\d{2})/) || [])[1] },
      status: parseStatus(line("Status")), from: line("From"), pr: line("Pull request"), source: "main",
    });
  });
  return { plan, tasks };
}
