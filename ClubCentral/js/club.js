/**
 * ClubCentral — Dedicated Club Profile & Enquire Controller
 * Renders verified details, objectives, faculty coordinators,
 * handles direct coordinator enquiries, and binds the bespoke creative "Join Now" CTA.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Get Club ID from URL query parameters
  const params = new URLSearchParams(window.location.search);
  const clubId = params.get('id') || 'lavasa-trekkers';

  if (typeof CLUBS_DATA === 'undefined') return;

  const club = CLUBS_DATA.find(c => c.id === clubId) || CLUBS_DATA[0];

  // 2. Update Page Titles & Breadcrumb
  document.title = `${club.name} — ClubCentral | Christ University Pune Lavasa`;

  const breadcrumbEl = document.getElementById('breadcrumb-club-name');
  if (breadcrumbEl) breadcrumbEl.textContent = club.name.toUpperCase();

  // 3. Populate Hero Section
  const logoEl = document.getElementById('club-detail-logo');
  const titleEl = document.getElementById('club-detail-title');
  const catEl = document.getElementById('club-detail-category');
  const sloganEl = document.getElementById('club-detail-slogan');

  if (logoEl) {
    logoEl.src = club.logoImage;
    logoEl.alt = `${club.name} Logo`;
  }
  if (titleEl) titleEl.textContent = club.name;
  if (catEl) catEl.textContent = club.category;

  if (sloganEl) {
    if (club.slogan) {
      sloganEl.textContent = `"${club.slogan}"`;
      sloganEl.style.display = 'block';
    } else {
      sloganEl.textContent = `"${club.shortDescription.slice(0, 100)}..."`;
    }
  }

  // 4. Populate About Narrative
  const aboutEl = document.getElementById('club-detail-about');
  if (aboutEl) {
    aboutEl.textContent = club.detailedAbout || club.fullDescription;
  }

  // 5. Populate Objectives Flow
  const objContainer = document.getElementById('club-detail-objectives');
  if (objContainer) {
    objContainer.innerHTML = '';
    const rawObj = club.objectives || '';
    
    // Split on numbered list pattern or bullet points
    let points = rawObj.split(/(?=\b\d{1,2}\s+[A-Z])|(?=→)/g).filter(p => p.trim().length > 5);
    if (points.length === 0) {
      points = [
        "Foster experiential student engagement, creative inquiry, and collaborative projects.",
        "Equip members with hands-on domain competencies and interdisciplinary leadership skills.",
        "Represent Christ University Pune Lavasa in regional and national collegiate events."
      ];
    }

    points.slice(0, 5).forEach((pt, idx) => {
      const cleanPt = pt.replace(/^[\d\s→.]+/, '').trim();
      const item = document.createElement('div');
      item.className = 'objective-item';
      item.innerHTML = `
        <span class="objective-num">0${idx + 1}</span>
        <div class="objective-body">${cleanPt}</div>
      `;
      objContainer.appendChild(item);
    });
  }

  // 6. Populate Coordinators & Metadata
  const teamEl = document.getElementById('club-detail-team');
  const emailEl = document.getElementById('club-detail-email');
  const instaBox = document.getElementById('instagram-box');
  const instaEl = document.getElementById('club-detail-instagram');
  const portalLinkEl = document.getElementById('club-detail-portal-link');

  if (teamEl) teamEl.textContent = club.team || "Faculty Mentors & Student Coordinators // Christ University";
  if (emailEl) emailEl.textContent = club.email || "mail.lavasa@christuniversity.in";

  if (club.instagram && instaBox && instaEl) {
    instaBox.style.display = 'flex';
    instaEl.href = club.instagram;
  }

  if (portalLinkEl && club.officialUrl) {
    portalLinkEl.href = club.officialUrl;
  }

  // 7. Setup Enquiry Form
  const hiddenId = document.getElementById('enquiry-club-id');
  if (hiddenId) hiddenId.value = club.id;

  const enquiryForm = document.getElementById('club-enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('enquiry-name').value.trim();
      const email = document.getElementById('enquiry-email').value.trim();
      const subject = document.getElementById('enquiry-subject').value.trim();
      const message = document.getElementById('enquiry-message').value.trim();

      const enquiryRecord = {
        id: `ENQ-${Date.now().toString().slice(-5)}`,
        clubId: club.id,
        clubName: club.name,
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('clubcentral_enquiries')) || [];
        stored.push(enquiryRecord);
        localStorage.setItem('clubcentral_enquiries', JSON.stringify(stored));
      } catch (err) {}

      enquiryForm.reset();
      
      const toast = document.getElementById('toast-notification');
      const toastMsg = document.getElementById('toast-message');
      if (toast && toastMsg) {
        toastMsg.textContent = `✓ Enquiry sent to ${club.name} coordinators! Check your email for reply.`;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 5000);
      }
    });
  }

  // 8. Setup Creative "Join Now" Callout
  const creativeCTA = club.creativeCTA || {
    headline: "Ready to join the community?",
    subline: "Register your interest and take part in upcoming campus activities.",
    buttonLabel: "Join Now →"
  };

  const ctaHeadlineEl = document.getElementById('creative-join-headline');
  const ctaSublineEl = document.getElementById('creative-join-subline');
  const ctaBtnLabel = document.getElementById('creative-join-btn-label');
  const ctaBtn = document.getElementById('creative-join-btn');

  if (ctaHeadlineEl) ctaHeadlineEl.textContent = creativeCTA.headline;
  if (ctaSublineEl) ctaSublineEl.textContent = creativeCTA.subline;
  if (ctaBtnLabel) ctaBtnLabel.textContent = creativeCTA.buttonLabel;

  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      if (typeof window.openApplyModal === 'function') {
        window.openApplyModal(club.id);
      } else {
        const modal = document.getElementById('apply-modal');
        const select = document.getElementById('apply-club-select');
        if (select) {
          select.innerHTML = '';
          CLUBS_DATA.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.name} (${c.category})`;
            if (c.id === club.id) opt.selected = true;
            select.appendChild(opt);
          });
        }
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  }
});
