/**
 * ClubCentral — edolus.com Authentic Loading Screen Controller
 * Stepped Rolling Percentage at bottom, central "ClubCentral" vector wordmark,
 * dual band vertical opening, and seamless 3D handoff.
 */

(function initEdolusLoader() {
  const wrapper = document.getElementById('custom-splash-wrapper');
  if (!wrapper) return;

  const logo = document.getElementById('custom-splash-logo');
  const progressWrap = document.getElementById('custom-bottom-progress-bar-wrap');
  const progressText = document.getElementById('custom-progress-text');
  const progressFill = document.querySelector('.custom-progress-line-fill');
  const statusLine = document.querySelector('.custom-progress-status-line');
  const cta = document.getElementById('custom-cta');
  const header = document.querySelector('.site-header');

  const rollCols = progressText.querySelectorAll('.roll-col');
  const NUM_COLS = 3;
  let currentVal = 0;
  let isDone = false;

  rollCols.forEach(col => {
    col.innerHTML = '<span class="roll-num">0</span>';
  });

  function getDigits(num) {
    const s = String(Math.floor(num)).padStart(3, '0');
    return [s[0], s[1], s[2]];
  }

  function updateOdometer(newVal) {
    const oldDigits = getDigits(currentVal);
    const newDigits = getDigits(newVal);

    for (let i = 0; i < NUM_COLS; i++) {
      if (oldDigits[i] !== newDigits[i] || newVal === 0) {
        const col = rollCols[i];
        col.innerHTML = `<span class="roll-num">${newDigits[i]}</span>`;
      }
    }

    currentVal = newVal;

    if (progressFill) {
      progressFill.style.width = `${Math.min(100, newVal)}%`;
    }

    if (statusLine) {
      if (newVal < 30) {
        statusLine.textContent = '[ INITIALIZING CLUBCENTRAL // PUNE LAVASA ]';
      } else if (newVal < 70) {
        statusLine.textContent = '[ SCANNING 23 ACTIVE STUDENT CLUBS // SAHYADRI HUB ]';
      } else if (newVal < 99) {
        statusLine.textContent = '[ SYNCING ORBITAL TELEMETRY // READY TO ENGAGE ]';
      } else {
        statusLine.textContent = '[ SYSTEM VERIFIED // 100% OPERATIONAL ]';
      }
    }
  }

  const startTime = performance.now();
  const LOAD_DURATION_MS = 2600; // 2.6s cinematic load

  function tickLoader(now) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(1, elapsed / LOAD_DURATION_MS);
    const easeProgress = 1 - Math.pow(1 - rawProgress, 3);
    const targetPercent = Math.min(100, Math.floor(easeProgress * 100));

    if (targetPercent > currentVal) {
      updateOdometer(targetPercent);
      if (window.playUiSound && targetPercent % 8 === 0) {
        window.playUiSound('hover');
      }
    }

    if (rawProgress < 1) {
      requestAnimationFrame(tickLoader);
    } else {
      updateOdometer(100);
      onLoadingComplete();
    }
  }

  requestAnimationFrame(tickLoader);

  function onLoadingComplete() {
    if (isDone) return;
    isDone = true;

    setTimeout(() => {
      // 1. Hide the bottom percentage readout
      if (progressWrap) {
        progressWrap.classList.add('hidden');
      }

      // 2. Open the black bands (top slides up, bottom slides down)
      wrapper.classList.add('bands-open');

      // 3. Fade out the cursive "ClubCentral" logo
      if (logo) {
        logo.classList.add('docked');
      }

      // 4. Smoothly hand off directly to live spacious 3D homepage
      setTimeout(() => {
        wrapper.classList.add('loaded');
        wrapper.classList.add('clicked');
        setTimeout(() => {
          wrapper.style.display = 'none';
          if (header) header.style.opacity = '1';
        }, 800);
      }, 450);

    }, 250);
  }

  // CTA Click: Initiate System & Enter Experience
  if (cta) {
    cta.addEventListener('click', () => {
      cta.classList.add('blink');
      wrapper.classList.add('clicked');

      if (window.playUiSound) {
        window.playUiSound('click');
        window.playUiSound('success');
      }

      setTimeout(() => {
        wrapper.style.display = 'none';
        if (header) {
          header.style.opacity = '1';
        }
      }, 1400);
    });
  }
})();
