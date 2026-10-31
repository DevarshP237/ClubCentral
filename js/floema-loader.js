/**
 * ClubCentral — Floema Loading Screen Controller
 * Requirements:
 * - Pure black background
 * - Centered "ClubCentral" in white elegant cursive italic font
 * - No subtitle or "deemed to be" text
 * - Bottom loading percentage ONLY (000% -> 100%), NO progress bar
 * - Smooth fade out handoff to 3D Floema landing page
 */

(function initFloemaLoader() {
  const loader = document.getElementById('floema-loader');
  const pctEl = document.getElementById('loader-pct');
  if (!loader || !pctEl) return;

  let current = 0;
  const duration = 2200; // 2.2 seconds elegant intro
  const startTime = performance.now();

  function formatPct(val) {
    return String(Math.floor(val)).padStart(3, '0') + '%';
  }

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    // Cubic ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    const targetVal = Math.min(100, Math.floor(eased * 100));

    if (targetVal > current) {
      current = targetVal;
      pctEl.textContent = formatPct(current);
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      pctEl.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
      }, 250);
    }
  }

  requestAnimationFrame(tick);
})();
