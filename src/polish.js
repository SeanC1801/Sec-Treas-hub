// Phone polish: the keyboard gets room, and top bars compact on scroll,
// for the hub, Minutes and Certificates (the Treasurer flow already does this).
const device = document.querySelector("#device");
const touch = () => matchMedia("(pointer:coarse)").matches;
const typing = (el) => el && (el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && /^(text|search|email|tel|url|number|password|)$/.test(el.type)));

document.addEventListener("focusin", (e) => { if (touch() && typing(e.target) && e.target.closest("#hub,#sec,#cert,#signin")) device.classList.add("kb"); });
document.addEventListener("focusout", () => setTimeout(() => { if (!typing(document.activeElement)) device.classList.remove("kb"); }, 60));

// top bars shrink after 24 px of scroll, as in the Treasurer flow
for (const id of ["#sec", "#cert"]) {
  const root = document.querySelector(id);
  root.addEventListener("scroll", () => root.querySelector(".topbar")?.classList.toggle("compact", root.scrollTop > 24), { passive: true });
}

// the step bar scrolls sideways on narrow phones: keep the current step in view
function showCurrentStep(scope) {
  scope.querySelectorAll(".tabs ol").forEach((ol) => {
    const cur = ol.querySelector('[aria-current="step"]'); if (!cur) return;
    const li = cur.closest("li"), l = li.offsetLeft, r = l + li.offsetWidth;
    if (l < ol.scrollLeft || r > ol.scrollLeft + ol.clientWidth) ol.scrollLeft = Math.max(0, r - ol.clientWidth + 12);
  });
}
const mo = new MutationObserver(() => setTimeout(() => showCurrentStep(device), 0));
for (const id of ["#tbSteps", "#sec", "#cert"]) { const el = document.querySelector(id); if (el) mo.observe(el, { childList: true }); }
