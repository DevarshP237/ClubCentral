/**
 * ClubCentral — Christ University Pune Lavasa Campus
 * Core Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentCategory = 'All Categories';
  let searchQuery = '';
  let sortOrder = 'az'; // 'az' | 'za'
  let eventsFilterGroup = 'all';

  // DOM Elements
  const featuredContainer = document.getElementById('featured-grid');
  const directoryContainer = document.getElementById('directory-grid');
  const categoriesContainer = document.getElementById('categories-container');
  const searchInput = document.getElementById('club-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const categorySelect = document.getElementById('category-filter-select');
  const sortSelect = document.getElementById('sort-select');
  const resultsCount = document.getElementById('results-count');
  const emptyState = document.getElementById('empty-state');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const eventsList = document.getElementById('events-list');
  const eventClubFilter = document.getElementById('event-club-filter');

  // Modals
  const clubDetailModal = document.getElementById('club-detail-modal');
  const applyModal = document.getElementById('apply-modal');
  const communityModal = document.getElementById('community-modal');
  const myAppsModal = document.getElementById('my-apps-modal');
  const submitListingModal = document.getElementById('submit-listing-modal');
  const submitEventModal = document.getElementById('submit-event-modal');
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');

  // Load Submitted Applications from localStorage
  function getStoredApplications() {
    try {
      return JSON.parse(localStorage.getItem('clubcentral_applications')) || [];
    } catch (e) {
      return [];
    }
  }

  function updateAppBadge() {
    const apps = getStoredApplications();
    const badges = document.querySelectorAll('.app-counter-badge');
    badges.forEach(b => {
      b.textContent = apps.length;
      b.style.display = apps.length > 0 ? 'inline-flex' : 'none';
    });
  }

  // Toast Trigger
  function showToast(msg) {
    if (!toast) return;
    toastMsg.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);
  }

  // Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.add('active');
    });
    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
      });
    }
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
      });
    });
  }

  // Render Category Chips
  function renderCategoryChips() {
    if (!categoriesContainer) return;
    categoriesContainer.innerHTML = '';

    // Calculate count per category
    const counts = { 'All Categories': CLUBS_DATA.length };
    CLUBS_DATA.forEach(club => {
      counts[club.category] = (counts[club.category] || 0) + 1;
    });

    CATEGORIES.forEach(cat => {
      const count = counts[cat] || 0;
      if (cat !== 'All Categories' && count === 0) return; // Only show categories with supplied listings

      const chip = document.createElement('button');
      chip.className = `category-chip ${cat === currentCategory ? 'active' : ''}`;
      chip.setAttribute('type', 'button');
      chip.innerHTML = `<span>${cat}</span><span class="count">${count}</span>`;
      chip.addEventListener('click', () => {
        currentCategory = cat;
        if (categorySelect) categorySelect.value = cat;
        renderCategoryChips();
        renderDirectory();
        // Smooth scroll to explore directory
        const exploreSection = document.getElementById('explore');
        if (exploreSection) {
          exploreSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
      categoriesContainer.appendChild(chip);
    });

    // Also sync dropdown options
    if (categorySelect) {
      categorySelect.innerHTML = '';
      CATEGORIES.forEach(cat => {
        const count = counts[cat] || 0;
        if (cat !== 'All Categories' && count === 0) return;
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = `${cat} (${count})`;
        opt.selected = (cat === currentCategory);
        categorySelect.appendChild(opt);
      });
    }
  }

  // Create Opportunity Card HTML (Floema Minimalist Capsule Card)
  function createClubCard(club) {
    const card = document.createElement('article');
    card.className = 'opportunity-card reveal-on-scroll';
    card.style.setProperty('--card-accent', club.accentColor || '#d4af37');

    card.innerHTML = `
      <div class="card-top">
        <div class="card-icon-emblem">
          <img src="${club.logoImage}" alt="${club.name} Crest" style="width: 44px; height: 44px; object-fit: contain;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'38\\' height=\\'38\\' fill=\\'%23ffffff\\' viewBox=\\'0 0 24 24\\'><circle cx=\\'12\\' cy=\\'12\\' r=\\'10\\'/></svg>'">
        </div>
        <span class="card-type-badge">${club.badge || club.category}</span>
      </div>
      <h3 class="card-group-name">${club.name}</h3>
      <div class="card-category-pill">
        <span>${club.category}</span>
      </div>
      <p class="card-description">${club.shortDescription}</p>
      <div class="card-footer">
        <a href="club.html?id=${club.id}" class="btn-primary card-enquire-btn" style="text-decoration:none; display: inline-flex;" data-club-id="${club.id}">
          <span>Enquire More →</span>
        </a>
      </div>
    `;

    // Click anywhere on card to redirect to club detail & enquire page
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      window.location.href = `club.html?id=${club.id}`;
    });

    return card;
  }

  // Render Featured Opportunities
  function renderFeaturedClubs() {
    if (!featuredContainer) return;
    featuredContainer.innerHTML = '';
    const featured = CLUBS_DATA.filter(c => c.isFeatured);
    featured.forEach(club => {
      featuredContainer.appendChild(createClubCard(club));
    });
  }

  // Render Directory
  function renderDirectory() {
    if (!directoryContainer) return;
    directoryContainer.innerHTML = '';

    let filtered = CLUBS_DATA.filter(club => {
      // Category filter
      if (currentCategory !== 'All Categories' && club.category !== currentCategory) {
        return false;
      }
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const inName = club.name.toLowerCase().includes(query);
        const inDesc = club.fullDescription.toLowerCase().includes(query);
        const inCat = club.category.toLowerCase().includes(query);
        const inActs = club.activities ? club.activities.toLowerCase().includes(query) : false;
        if (!inName && !inDesc && !inCat && !inActs) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortOrder === 'az') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    // Update count
    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} of ${CLUBS_DATA.length} student clubs`;
    }

    // Empty state
    if (filtered.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      filtered.forEach(club => {
        directoryContainer.appendChild(createClubCard(club));
      });
    }

    // Trigger scroll animations for new elements
    const newItems = directoryContainer.querySelectorAll('.reveal-on-scroll');
    newItems.forEach(el => el.classList.add('revealed'));
  }

  // Search Input Handlers
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
      }
      renderDirectory();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderDirectory();
      if (searchInput) searchInput.focus();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      renderCategoryChips();
      renderDirectory();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortOrder = e.target.value;
      renderDirectory();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      currentCategory = 'All Categories';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      if (categorySelect) categorySelect.value = 'All Categories';
      renderCategoryChips();
      renderDirectory();
    });
  }

  // ==========================================================================
  // CLUB DETAIL MODAL
  // ==========================================================================
  function openClubDetailModal(clubId) {
    const club = CLUBS_DATA.find(c => c.id === clubId);
    if (!club || !clubDetailModal) return;

    // Populate modal
    const logoImg = document.getElementById('modal-club-logo');
    const nameEl = document.getElementById('modal-club-name');
    const badgeEl = document.getElementById('modal-club-badge');
    const catEl = document.getElementById('modal-club-category');
    const descEl = document.getElementById('modal-club-description');
    const actEl = document.getElementById('modal-club-activities');
    const schedEl = document.getElementById('modal-club-schedule');
    const locEl = document.getElementById('modal-club-location');
    const eligEl = document.getElementById('modal-club-eligibility');
    const contactEl = document.getElementById('modal-club-contact');
    const applyGuideEl = document.getElementById('modal-club-apply-guide');
    const applyBtn = document.getElementById('modal-apply-btn');

    if (logoImg) logoImg.src = club.logoImage;
    if (nameEl) nameEl.textContent = club.name;
    if (badgeEl) badgeEl.textContent = club.badge || club.type;
    if (catEl) catEl.textContent = club.category;
    if (descEl) descEl.textContent = club.fullDescription;
    if (actEl) actEl.textContent = club.activities || "Details coming soon";

    // Strict compliance: if not supplied, label "Details coming soon"
    if (schedEl) {
      schedEl.innerHTML = club.meetingSchedule 
        ? club.meetingSchedule 
        : `<span class="badge-coming-soon">Details coming soon</span>`;
    }
    if (locEl) {
      locEl.innerHTML = club.location 
        ? club.location 
        : `<span class="badge-coming-soon">Details coming soon</span>`;
    }
    if (eligEl) {
      eligEl.innerHTML = club.eligibility 
        ? club.eligibility 
        : `Open to registered Christ University Pune Lavasa students. Specific prerequisites: <span class="badge-coming-soon">Details coming soon</span>`;
    }
    if (contactEl) {
      contactEl.innerHTML = club.contactInfo 
        ? club.contactInfo 
        : `Official coordinator and social links: <span class="badge-coming-soon">Details coming soon</span>`;
    }
    if (applyGuideEl) {
      applyGuideEl.textContent = club.howToApply;
    }

    if (applyBtn) {
      applyBtn.setAttribute('data-club-id', club.id);
      applyBtn.onclick = () => {
        closeModal(clubDetailModal);
        openApplyModal(club.id);
      };
    }

    // Open modal
    openModal(clubDetailModal);
  }

  // Expose globally
  window.openClubDetailModal = openClubDetailModal;

  // ==========================================================================
  // APPLICATION MODAL & FORM
  // ==========================================================================
  const applyClubSelect = document.getElementById('apply-club-select');
  const applyForm = document.getElementById('club-application-form');

  function openApplyModal(preselectedClubId = null) {
    if (!applyModal) return;

    // Populate club dropdown
    if (applyClubSelect) {
      applyClubSelect.innerHTML = '';
      CLUBS_DATA.forEach(club => {
        const opt = document.createElement('option');
        opt.value = club.id;
        opt.textContent = `${club.name} (${club.category})`;
        if (preselectedClubId && club.id === preselectedClubId) {
          opt.selected = true;
        }
        applyClubSelect.appendChild(opt);
      });
    }

    openModal(applyModal);
  }

  // Expose globally
  window.openApplyModal = openApplyModal;

  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clubId = applyClubSelect ? applyClubSelect.value : '';
      const club = CLUBS_DATA.find(c => c.id === clubId);
      const studentName = document.getElementById('applicant-name').value.trim();
      const studentReg = document.getElementById('applicant-reg').value.trim();
      const studentEmail = document.getElementById('applicant-email').value.trim();
      const program = document.getElementById('applicant-program').value;
      const year = document.getElementById('applicant-year').value;
      const statement = document.getElementById('applicant-statement').value.trim();

      const appId = `CULAV-${Date.now().toString().slice(-5)}`;
      const newApp = {
        appId,
        clubId,
        clubName: club ? club.name : clubId,
        category: club ? club.category : '',
        studentName,
        studentReg,
        studentEmail,
        program,
        year,
        statement,
        submittedAt: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'Submitted — Pending Review by Coordinator'
      };

      const existing = getStoredApplications();
      existing.unshift(newApp);
      localStorage.setItem('clubcentral_applications', JSON.stringify(existing));

      updateAppBadge();
      closeModal(applyModal);
      applyForm.reset();

      showToast(`🎉 Application for ${newApp.clubName} submitted successfully! Ref: ${appId}`);
    });
  }

  // ==========================================================================
  // "MY APPLICATIONS" MODAL
  // ==========================================================================
  const myAppsBtn = document.getElementById('view-my-apps-btn');
  const myAppsList = document.getElementById('my-apps-list');

  function openMyAppsModal() {
    if (!myAppsModal || !myAppsList) return;
    const apps = getStoredApplications();
    myAppsList.innerHTML = '';

    if (apps.length === 0) {
      myAppsList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: var(--text-muted);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <p style="font-weight: 600; font-size: 1.05rem; margin-bottom: 6px;">No applications submitted yet</p>
          <p style="font-size: 0.88rem;">Explore the 23 student clubs and apply to join your favorites!</p>
        </div>
      `;
    } else {
      apps.forEach(app => {
        const item = document.createElement('div');
        item.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; margin-bottom: 14px;';
        item.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <h4 style="font-size: 1.15rem; color: #ffffff; margin-bottom: 4px;">${app.clubName}</h4>
              <span style="font-size: 0.78rem; color: var(--christ-gold); font-weight: 600;">Ref: ${app.appId} • ${app.submittedAt}</span>
            </div>
            <span style="font-size: 0.75rem; padding: 4px 10px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-full); font-weight: 700;">
              ${app.status}
            </span>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 8px;">
            Applicant: <strong>${app.studentName}</strong> (${app.studentReg}) • ${app.program} (${app.year})
          </p>
          <div style="font-size: 0.84rem; color: var(--text-muted); background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: var(--radius-sm);">
            <em>"${app.statement}"</em>
          </div>
        `;
        myAppsList.appendChild(item);
      });
    }

    openModal(myAppsModal);
  }

  if (myAppsBtn) {
    myAppsBtn.addEventListener('click', openMyAppsModal);
  }

  // ==========================================================================
  // "FIND YOUR COMMUNITY" INTERACTIVE MATCHER QUIZ
  // ==========================================================================
  const findCommunityBtn = document.getElementById('find-community-btn');
  const heroFindBtn = document.getElementById('hero-find-btn');
  const matcherStep1 = document.getElementById('matcher-step-1');
  const matcherStep2 = document.getElementById('matcher-step-2');
  const matcherResults = document.getElementById('matcher-results');
  const matcherRecommendations = document.getElementById('matcher-recommendations');
  const matcherRestart = document.getElementById('matcher-restart-btn');

  let chosenInterest = '';
  let chosenGoal = '';

  function openCommunityMatcher() {
    if (!communityModal) return;
    chosenInterest = '';
    chosenGoal = '';
    if (matcherStep1) matcherStep1.style.display = 'block';
    if (matcherStep2) matcherStep2.style.display = 'none';
    if (matcherResults) matcherResults.style.display = 'none';
    openModal(communityModal);
  }

  if (findCommunityBtn) findCommunityBtn.addEventListener('click', openCommunityMatcher);
  if (heroFindBtn) heroFindBtn.addEventListener('click', openCommunityMatcher);

  document.querySelectorAll('.quiz-option-interest').forEach(btn => {
    btn.addEventListener('click', () => {
      chosenInterest = btn.getAttribute('data-interest');
      if (matcherStep1) matcherStep1.style.display = 'none';
      if (matcherStep2) matcherStep2.style.display = 'block';
    });
  });

  document.querySelectorAll('.quiz-option-goal').forEach(btn => {
    btn.addEventListener('click', () => {
      chosenGoal = btn.getAttribute('data-goal');
      calculateMatches();
    });
  });

  function calculateMatches() {
    if (matcherStep2) matcherStep2.style.display = 'none';
    if (matcherResults) matcherResults.style.display = 'block';

    // Scoring logic based on interest & goal
    let matches = CLUBS_DATA.map(club => {
      let score = 0;
      if (chosenInterest === 'outdoor' && (club.category.includes('Outdoor') || club.category.includes('Sports'))) score += 5;
      if (chosenInterest === 'arts' && (club.category.includes('Arts') || club.category.includes('Performing') || club.category.includes('Cinema') || club.category.includes('Music'))) score += 5;
      if (chosenInterest === 'gaming' && (club.category.includes('Gaming') || club.category.includes('Esports'))) score += 5;
      if (chosenInterest === 'service' && (club.category.includes('Service') || club.category.includes('Health') || club.category.includes('Ecology'))) score += 5;
      if (chosenInterest === 'academic' && (club.category.includes('Academic') || club.category.includes('Communication') || club.category.includes('Business'))) score += 5;

      // Bonus for featured
      if (club.isFeatured) score += 1;
      return { club, score };
    });

    matches.sort((a, b) => b.score - a.score);
    const top3 = matches.slice(0, 3).map(m => m.club);

    if (matcherRecommendations) {
      matcherRecommendations.innerHTML = '';
      top3.forEach(club => {
        const item = document.createElement('div');
        item.style.cssText = 'background: rgba(255,255,255,0.04); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px;';
        item.innerHTML = `
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${club.logoImage}" alt="${club.name}" style="width: 44px; height: 44px; object-fit: contain;">
            <div>
              <h4 style="font-size: 1.15rem; color: #ffffff; margin-bottom: 2px;">${club.name}</h4>
              <span style="font-size: 0.8rem; color: #aaaaaa;">${club.category}</span>
              <p style="font-size: 0.86rem; color: #888888; margin-top: 4px;">${club.shortDescription}</p>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-shrink: 0;">
            <a href="club.html?id=${club.id}" class="floema-pill-btn" style="text-decoration:none; font-size: 0.8rem; padding: 7px 14px; white-space: nowrap;">
              Enquire →
            </a>
            <button type="button" class="floema-pill-btn active apply-from-match-btn" data-club-id="${club.id}" style="font-size: 0.8rem; padding: 7px 14px; white-space: nowrap; cursor: pointer;">
              Join
            </button>
          </div>
        `;

        item.querySelector('.apply-from-match-btn').addEventListener('click', () => {
          closeModal(communityModal);
          openApplyModal(club.id);
        });

        matcherRecommendations.appendChild(item);
      });
    }
  }

  if (matcherRestart) {
    matcherRestart.addEventListener('click', () => {
      openCommunityMatcher();
    });
  }

  // ==========================================================================
  // EVENTS FEED & FILTER
  // ==========================================================================
  function renderEvents() {
    if (!eventsList) return;
    eventsList.innerHTML = '';

    // Populate club filter dropdown
    if (eventClubFilter && eventClubFilter.children.length <= 1) {
      CLUBS_DATA.forEach(club => {
        const opt = document.createElement('option');
        opt.value = club.id;
        opt.textContent = club.name;
        eventClubFilter.appendChild(opt);
      });
    }

    let filtered = INITIAL_EVENTS;
    if (eventsFilterGroup !== 'all') {
      filtered = INITIAL_EVENTS.filter(e => e.hostGroupId === eventsFilterGroup);
    }

    if (filtered.length === 0) {
      eventsList.innerHTML = `
        <div style="text-align: center; padding: 48px 24px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
          <p style="font-size: 1.1rem; color: #ffffff; margin-bottom: 8px;">No scheduled events found for this filter</p>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 18px;">Would you like to explore the student clubs directly?</p>
          <button type="button" class="btn-secondary" onclick="document.getElementById('explore').scrollIntoView({behavior:'smooth'})">Explore All Clubs</button>
        </div>
      `;
      return;
    }

    filtered.forEach(evt => {
      const dateObj = new Date(evt.date);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
      const year = dateObj.getFullYear();

      const card = document.createElement('div');
      card.className = 'event-card reveal-on-scroll';
      card.innerHTML = `
        <div class="event-date-badge">
          <span class="event-day">${day}</span>
          <span class="event-month">${month}</span>
          <span class="event-year">${year}</span>
        </div>
        <div class="event-details">
          <span class="event-host-tag">${evt.hostGroupName}</span>
          <h3 class="event-title">${evt.title}</h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 6px 0;">${evt.description}</p>
          <div class="event-meta-info">
            <div class="event-meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>${evt.time}</span>
            </div>
            <div class="event-meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${evt.location}</span>
            </div>
          </div>
        </div>
        <div class="event-action-btn">
          <button type="button" class="btn-primary event-reg-btn" data-host-id="${evt.hostGroupId}" style="padding: 10px 18px; font-size: 0.86rem;">
            Register & Details
          </button>
        </div>
      `;

      card.querySelector('.event-reg-btn').addEventListener('click', () => {
        openApplyModal(evt.hostGroupId);
      });

      eventsList.appendChild(card);
    });
  }

  if (eventClubFilter) {
    eventClubFilter.addEventListener('change', (e) => {
      eventsFilterGroup = e.target.value;
      renderEvents();
    });
  }

  // ==========================================================================
  // SUBMIT / UPDATE LISTING & EVENT MODALS
  // ==========================================================================
  const openSubmitListingBtn = document.getElementById('open-submit-listing-btn');
  const listingForm = document.getElementById('club-listing-form');

  if (openSubmitListingBtn && submitListingModal) {
    openSubmitListingBtn.addEventListener('click', () => {
      openModal(submitListingModal);
    });
  }

  if (listingForm) {
    listingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clubName = document.getElementById('listing-name').value;
      closeModal(submitListingModal);
      listingForm.reset();
      showToast(`📝 Update for "${clubName}" submitted to university moderators for review!`);
    });
  }

  const openSubmitEventBtn = document.getElementById('open-submit-event-btn');
  const eventForm = document.getElementById('submit-event-form');

  if (openSubmitEventBtn && submitEventModal) {
    openSubmitEventBtn.addEventListener('click', () => {
      // populate organizer club options
      const hostSelect = document.getElementById('new-event-host');
      if (hostSelect && hostSelect.children.length === 0) {
        CLUBS_DATA.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = c.name;
          hostSelect.appendChild(opt);
        });
      }
      openModal(submitEventModal);
    });
  }

  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('new-event-title').value;
      const hostId = document.getElementById('new-event-host').value;
      const hostClub = CLUBS_DATA.find(c => c.id === hostId);
      const date = document.getElementById('new-event-date').value;
      const time = document.getElementById('new-event-time').value;
      const location = document.getElementById('new-event-loc').value;
      const desc = document.getElementById('new-event-desc').value;

      const newEvt = {
        id: `evt-${Date.now()}`,
        title,
        hostGroupId: hostId,
        hostGroupName: hostClub ? hostClub.name : 'Student Club',
        date,
        time,
        location,
        description: desc,
        registrationLink: "#apply",
        isRegistrationOpen: true,
        category: hostClub ? hostClub.category : 'General'
      };

      INITIAL_EVENTS.unshift(newEvt);
      renderEvents();
      closeModal(submitEventModal);
      eventForm.reset();
      showToast(`📅 Event "${title}" posted to ClubCentral events calendar!`);
    });
  }

  // ==========================================================================
  // MODAL UTILITIES (Open, Close, Keyboard Accessible)
  // ==========================================================================
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        closeModal(modal);
      });
      if (mobileNavDrawer) mobileNavDrawer.classList.remove('active');
    }
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Initial Boot
  renderCategoryChips();
  renderFeaturedClubs();
  renderDirectory();
  renderEvents();
  updateAppBadge();
});
