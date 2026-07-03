/**
 * Food Portal Logic
 * Tracks Breakfast and Lunch collections for Approved participants
 */
import { auth, db, EVENT_NAMES } from './firebase.js';
import { 
  signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { 
  collection, getDocs, doc, getDoc, updateDoc, query 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// DOM Elements
const loginSection = document.getElementById('login-section');
const loadingSection = document.getElementById('loading-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const adminNavLink = document.getElementById('admin-nav-link');
const hrNavLink = document.getElementById('hr-nav-link');
const userRoleBadge = document.getElementById('user-role-badge');

const breakfastCollectedEl = document.getElementById('breakfast-collected');
const breakfastTotalEl = document.getElementById('breakfast-total');
const breakfastProgressEl = document.getElementById('breakfast-progress');
const breakfastPercentageEl = document.getElementById('breakfast-percentage');

const lunchCollectedEl = document.getElementById('lunch-collected');
const lunchTotalEl = document.getElementById('lunch-total');
const lunchProgressEl = document.getElementById('lunch-progress');
const lunchPercentageEl = document.getElementById('lunch-percentage');

const tabBreakfast = document.getElementById('tab-breakfast');
const tabLunch = document.getElementById('tab-lunch');

const searchInput = document.getElementById('search-input');
const eventFilter = document.getElementById('event-filter');
const collectionFilter = document.getElementById('collection-filter');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const eventSectionsContainer = document.getElementById('event-sections-container');

// State Variables
let registrationsData = [];
let institutionalData = [];
let flatParticipants = [];
let activeMealTab = 'breakfast'; // 'breakfast' or 'lunch'

const TEAM_LIMITS = {
  film_making: 5, moot_court: 4, spark_tank: 4, 
  raag_jaam: 6, hackathon: 1, debate: 2, ipl: 4
};

// Expanded accordion IDs
let expandedEventSections = new Set(['all']); // Keep track of open event accordions

// ─── Authorization Access Check ───
const FALLBACK_ADMIN = "dhamindhankher2010@gmail.com";
async function checkUserAccess(email) {
  try {
    // 1. Check Admin
    const adminSnap = await getDoc(doc(db, 'settings', 'admins'));
    if (adminSnap.exists() && adminSnap.data().emails?.includes(email)) {
      return { authorized: true, role: 'admin' };
    }
    // 2. Check HR
    const hrSnap = await getDoc(doc(db, 'settings', 'hr'));
    if (hrSnap.exists() && hrSnap.data().emails?.includes(email)) {
      return { authorized: true, role: 'hr' };
    }
    // Fallback
    if (email === FALLBACK_ADMIN) {
      return { authorized: true, role: 'admin' };
    }
  } catch (e) {
    console.error("Access check err:", e);
  }
  return { authorized: false, role: null };
}

// ─── Auth State Handler ───
let authResolved = false;
setTimeout(() => { if (!authResolved) { showSection('login'); } }, 5000);

onAuthStateChanged(auth, async (user) => {
  authResolved = true;
  if (user) {
    showLoading("Checking permissions...");
    const access = await checkUserAccess(user.email);
    if (access.authorized) {
      userRoleBadge.textContent = access.role === 'admin' ? 'Admin Officer' : 'HR Officer';
      if (access.role === 'admin') {
        adminNavLink.style.display = 'inline-block';
      }
      hrNavLink.style.display = 'inline-block'; // Both Admin and HR can access HR panel

      showLoading("Loading approved registrations...");
      await fetchApprovedData();
    } else {
      showLoading("Access Denied.");
      document.querySelector('.spinner').style.display = 'none';
      document.getElementById('loading-text').classList.add('error-text');
      setTimeout(() => signOut(auth), 3000);
    }
  } else {
    showSection('login');
  }
});

// ─── Log in Handler ───
loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const loginBtn = document.getElementById('login-btn');
  
  loginError.textContent = "";
  loginBtn.disabled = true;
  loginBtn.textContent = "Verifying...";

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    console.error("Login err:", err);
    loginError.textContent = "Invalid login credentials or unauthorized access.";
    loginBtn.disabled = false;
    loginBtn.textContent = "Authorize Entry →";
  }
};

// ─── Log out Handler ───
logoutBtn.onclick = () => signOut(auth);

// ─── Data Fetching & Parsing ───
async function fetchApprovedData() {
  try {
    // 1. Fetch ALL individual registrations, then filter for approved
    const qIndiv = query(collection(db, "registrations"));
    const snapIndiv = await getDocs(qIndiv);
    registrationsData = [];
    snapIndiv.forEach(d => {
      const data = d.data();
      if (data.status === 'approved') {
        registrationsData.push({ id: d.id, ...data });
      }
    });

    // 2. Fetch ALL institutional registrations, then filter for approved
    const qInst = query(collection(db, "institutional_registrations"));
    const snapInst = await getDocs(qInst);
    institutionalData = [];
    snapInst.forEach(d => {
      const data = d.data();
      if (data.status === 'approved') {
        institutionalData.push({ id: d.id, ...data });
      }
    });

    // Flatten all participants
    parseParticipants();

    // Set all event accordions to open by default on initial fetch
    const uniqueEvents = [...new Set(flatParticipants.map(p => p.event))];
    uniqueEvents.forEach(ev => expandedEventSections.add(ev));

    // Update stats and render dashboard
    updateStatsDisplay();
    renderFilteredList();
    showSection('dashboard');
  } catch (error) {
    console.error("Fetch data error:", error);
    showLoading("Failed to load registrations: " + error.message);
    document.querySelector('.spinner').style.display = 'none';
    document.getElementById('loading-text').classList.add('error-text');
  }
}

function parseParticipants() {
  flatParticipants = [];

  // Individual registrations parsing
  registrationsData.forEach(reg => {
    // Check if team event based on limit
    const maxLimit = TEAM_LIMITS[reg.event] || 1;
    const isTeamEvent = maxLimit > 1;

    // Leader
    flatParticipants.push({
      id: `${reg.id}-leader`,
      docId: reg.id,
      regType: 'individual',
      isLeader: true,
      memberIndex: -1,
      firstName: reg.firstName || '',
      lastName: reg.lastName || '',
      email: reg.email || '',
      phone: reg.phone || '',
      school: reg.school || '',
      city: reg.city || '',
      event: reg.event || '',
      isGroupEvent: isTeamEvent,
      parentName: `${reg.firstName || ''} ${reg.lastName || ''}`.trim(),
      collectedBreakfast: reg.collectedBreakfast || false,
      collectedLunch: reg.collectedLunch || false
    });

    // Team members
    const teamMembers = reg.teamMembers || [];
    teamMembers.forEach((m, idx) => {
      flatParticipants.push({
        id: `${reg.id}-member-${idx}`,
        docId: reg.id,
        regType: 'individual',
        isLeader: false,
        memberIndex: idx,
        firstName: m.firstName || '',
        lastName: m.lastName || '',
        email: m.email || '',
        phone: m.phone || '',
        school: m.school || reg.school || '',
        city: reg.city || '',
        event: reg.event || '',
        isGroupEvent: isTeamEvent,
        parentName: `${reg.firstName || ''} ${reg.lastName || ''}`.trim(),
        collectedBreakfast: m.collectedBreakfast || false,
        collectedLunch: m.collectedLunch || false
      });
    });
  });

  // Institutional registrations parsing
  institutionalData.forEach(inst => {
    const participants = inst.participants || [];
    participants.forEach((p, pIdx) => {
      const maxLimit = TEAM_LIMITS[p.event] || 1;
      const isTeamEvent = maxLimit > 1;

      // Primary participant inside the list (leader)
      flatParticipants.push({
        id: `${inst.id}-p-${pIdx}-leader`,
        docId: inst.id,
        regType: 'institutional',
        isLeader: true,
        participantIndex: pIdx,
        memberIndex: -1,
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        email: p.email || '',
        phone: p.phone || '',
        school: inst.institutionName || '',
        city: inst.institutionCity || '',
        event: p.event || '',
        isGroupEvent: isTeamEvent,
        parentName: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        collectedBreakfast: p.collectedBreakfast || false,
        collectedLunch: p.collectedLunch || false
      });

      // Team members for this institutional participant entry
      const teamMembers = p.teamMembers || [];
      teamMembers.forEach((m, mIdx) => {
        flatParticipants.push({
          id: `${inst.id}-p-${pIdx}-member-${mIdx}`,
          docId: inst.id,
          regType: 'institutional',
          isLeader: false,
          participantIndex: pIdx,
          memberIndex: mIdx,
          firstName: m.firstName || '',
          lastName: m.lastName || '',
          email: m.email || '',
          phone: m.phone || '',
          school: inst.institutionName || '',
          city: inst.institutionCity || '',
          event: p.event || '',
          isGroupEvent: isTeamEvent,
          parentName: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
          collectedBreakfast: m.collectedBreakfast || false,
          collectedLunch: m.collectedLunch || false
        });
      });
    });
  });
}

// ─── Stats Display Update ───
function updateStatsDisplay() {
  const totalCount = flatParticipants.length;
  
  const breakfastCollectedCount = flatParticipants.filter(p => p.collectedBreakfast).length;
  const breakfastPct = totalCount > 0 ? Math.round((breakfastCollectedCount / totalCount) * 100) : 0;
  breakfastCollectedEl.textContent = breakfastCollectedCount;
  breakfastTotalEl.textContent = totalCount;
  breakfastProgressEl.style.width = `${breakfastPct}%`;
  breakfastPercentageEl.textContent = `${breakfastPct}% collected`;

  const lunchCollectedCount = flatParticipants.filter(p => p.collectedLunch).length;
  const lunchPct = totalCount > 0 ? Math.round((lunchCollectedCount / totalCount) * 100) : 0;
  lunchCollectedEl.textContent = lunchCollectedCount;
  lunchTotalEl.textContent = totalCount;
  lunchProgressEl.style.width = `${lunchPct}%`;
  lunchPercentageEl.textContent = `${lunchPct}% collected`;
}

// ─── Tab Switching ───
function switchMealTab(mealType) {
  if (mealType === activeMealTab) return;
  activeMealTab = mealType;

  // UI updates
  tabBreakfast.classList.toggle('active', mealType === 'breakfast');
  tabLunch.classList.toggle('active', mealType === 'lunch');

  renderFilteredList();
}
window.switchMealTab = switchMealTab;

// ─── Toggling Meal Collection ───
async function handleMealToggle(participantId, buttonEl) {
  const p = flatParticipants.find(item => item.id === participantId);
  if (!p) return;

  const currentStatus = activeMealTab === 'breakfast' ? p.collectedBreakfast : p.collectedLunch;
  const nextStatus = !currentStatus;

  // Add visual saving indicator
  buttonEl.classList.add('saving');
  buttonEl.disabled = true;
  const originalHtml = buttonEl.innerHTML;
  buttonEl.innerHTML = `<span class="toggle-icon">⏳</span> Updating...`;

  try {
    if (p.regType === 'individual') {
      await toggleIndividualMealInFirestore(p.docId, p.isLeader, p.memberIndex, activeMealTab, nextStatus);
    } else {
      await toggleInstitutionalMealInFirestore(p.docId, p.participantIndex, p.isLeader, p.memberIndex, activeMealTab, nextStatus);
    }

    // Update local status
    if (activeMealTab === 'breakfast') {
      p.collectedBreakfast = nextStatus;
    } else {
      p.collectedLunch = nextStatus;
    }

    // Update table row styling
    const rowEl = document.getElementById(`row-${participantId}`);
    if (rowEl) {
      rowEl.classList.toggle('collected-row', nextStatus);
    }

    // Recalculate and update stats
    updateStatsDisplay();

    // Re-render button
    renderToggleButton(buttonEl, p, participantId);

    // Update event badge count in the accordion header
    updateEventBadgeCount(p.event);

  } catch (error) {
    console.error("Failed to update meal status:", error);
    alert("Error updating meal status: " + error.message);
    // Revert button visual state
    buttonEl.innerHTML = originalHtml;
  } finally {
    buttonEl.classList.remove('saving');
    buttonEl.disabled = false;
  }
}
window.handleMealToggle = handleMealToggle;

function renderToggleButton(btnEl, p, pId) {
  const isCollected = activeMealTab === 'breakfast' ? p.collectedBreakfast : p.collectedLunch;
  if (isCollected) {
    btnEl.className = "meal-toggle-btn collected";
    btnEl.innerHTML = `<span class="toggle-icon">✓</span> Collected`;
  } else {
    btnEl.className = "meal-toggle-btn";
    btnEl.innerHTML = `<span class="toggle-icon">○</span> Mark Collected`;
  }
}

// ─── Firestore Operations ───
async function toggleIndividualMealInFirestore(docId, isLeader, memberIndex, mealType, newValue) {
  const docRef = doc(db, 'registrations', docId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("Registration record not found");

  const data = snap.data();
  if (isLeader) {
    const field = mealType === 'breakfast' ? 'collectedBreakfast' : 'collectedLunch';
    await updateDoc(docRef, { [field]: newValue });
  } else {
    const teamMembers = [...(data.teamMembers || [])];
    if (teamMembers[memberIndex]) {
      if (mealType === 'breakfast') {
        teamMembers[memberIndex].collectedBreakfast = newValue;
      } else {
        teamMembers[memberIndex].collectedLunch = newValue;
      }
      await updateDoc(docRef, { teamMembers: teamMembers });
    } else {
      throw new Error(`Member at index ${memberIndex} not found in teamMembers list.`);
    }
  }
}

async function toggleInstitutionalMealInFirestore(docId, participantIdx, isLeader, memberIdx, mealType, newValue) {
  const docRef = doc(db, 'institutional_registrations', docId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("Institutional registration not found");

  const data = snap.data();
  const participants = [...(data.participants || [])];
  const p = participants[participantIdx];
  if (!p) throw new Error("Institutional participant not found");

  if (isLeader) {
    if (mealType === 'breakfast') {
      p.collectedBreakfast = newValue;
    } else {
      p.collectedLunch = newValue;
    }
  } else {
    const teamMembers = [...(p.teamMembers || [])];
    if (teamMembers[memberIdx]) {
      if (mealType === 'breakfast') {
        teamMembers[memberIdx].collectedBreakfast = newValue;
      } else {
        teamMembers[memberIdx].collectedLunch = newValue;
      }
      p.teamMembers = teamMembers;
    } else {
      throw new Error(`Member at index ${memberIdx} not found in participant's team.`);
    }
  }

  participants[participantIdx] = p;
  await updateDoc(docRef, { participants: participants });
}

// ─── Rendering Event-wise Groups ───
function renderFilteredList() {
  const term = searchInput.value.toLowerCase().trim();
  const selectedEvent = eventFilter.value;
  const colFilter = collectionFilter.value;

  // Apply filters to flat list
  let filtered = flatParticipants;

  if (term) {
    filtered = filtered.filter(p => {
      const name = `${p.firstName} ${p.lastName}`.toLowerCase();
      const email = p.email.toLowerCase();
      const phone = p.phone.toLowerCase();
      const school = p.school.toLowerCase();
      const parentName = p.parentName.toLowerCase();
      return name.includes(term) || email.includes(term) || phone.includes(term) || school.includes(term) || parentName.includes(term);
    });
  }

  if (selectedEvent !== 'all') {
    filtered = filtered.filter(p => p.event === selectedEvent);
  }

  if (colFilter !== 'all') {
    const targetStatus = colFilter === 'collected';
    filtered = filtered.filter(p => {
      const collected = activeMealTab === 'breakfast' ? p.collectedBreakfast : p.collectedLunch;
      return collected === targetStatus;
    });
  }

  if (!filtered.length) {
    eventSectionsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🍽️</div>
        <div class="empty-state-text">No eligible participants found matching the filters.</div>
      </div>
    `;
    return;
  }

  // Group filtered participants by event
  const groups = {};
  filtered.forEach(p => {
    if (!groups[p.event]) {
      groups[p.event] = [];
    }
    groups[p.event].push(p);
  });

  const sortedEvents = Object.keys(groups).sort((a, b) => {
    const nameA = EVENT_NAMES[a] || a;
    const nameB = EVENT_NAMES[b] || b;
    return nameA.localeCompare(nameB);
  });

  let html = '';
  sortedEvents.forEach(eventKey => {
    const list = groups[eventKey];
    const eventName = EVENT_NAMES[eventKey] || eventKey;
    const isExpanded = expandedEventSections.has(eventKey);

    // Calculate collected count for this event specifically
    const totalEventCount = list.length;
    const collectedEventCount = list.filter(p => {
      return activeMealTab === 'breakfast' ? p.collectedBreakfast : p.collectedLunch;
    }).length;

    const isAllCompleted = totalEventCount > 0 && collectedEventCount === totalEventCount;
    const badgeClass = isAllCompleted ? "event-stats-badge completed" : "event-stats-badge";
    const badgeText = isAllCompleted ? "✓ Completed" : `${collectedEventCount} / ${totalEventCount} Collected`;

    html += `
      <div class="event-section ${isExpanded ? 'expanded' : ''}" id="event-sec-${eventKey}">
        <div class="event-header-accordion" onclick="toggleAccordion('${eventKey}')">
          <div class="event-title-group">
            <span class="event-icon-badge">📅</span>
            <span class="event-name-text">${eventName}</span>
            <span class="${badgeClass}" id="badge-${eventKey}">${badgeText}</span>
          </div>
          <div class="accordion-chevron">▼</div>
        </div>
        <div class="event-content-table">
          <table class="food-table">
            <thead>
              <tr>
                <th>Participant Details</th>
                <th>Institution</th>
                <th>Role / Group details</th>
                <th style="text-align: right;">Meal Status</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(p => {
                const isCollected = activeMealTab === 'breakfast' ? p.collectedBreakfast : p.collectedLunch;
                const rowClass = isCollected ? "collected-row" : "";
                
                // Construct role badge
                let roleBadgeHtml = '';
                if (!p.isGroupEvent) {
                  roleBadgeHtml = `<span class="role-badge solo">👤 Solo</span>`;
                } else if (p.isLeader) {
                  roleBadgeHtml = `<span class="role-badge leader">👑 Leader</span>`;
                } else {
                  roleBadgeHtml = `
                    <span class="role-badge member">👥 Member</span>
                    <div class="leader-ref">Leader: ${p.parentName}</div>
                  `;
                }

                return `
                  <tr id="row-${p.id}" class="${rowClass}">
                    <td>
                      <div style="font-weight: 600; color: #fff; font-size: 0.92rem;">${p.firstName} ${p.lastName}</div>
                      <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 3px;">
                        <a href="mailto:${p.email}" style="color: var(--text-muted); text-decoration: none;">${p.email}</a> · ${p.phone || '—'}
                      </div>
                    </td>
                    <td>
                      <div style="color: #fff; font-weight: 500;">${p.school || '—'}</div>
                      <div style="color: var(--text-dimmed); font-size: 0.75rem; margin-top: 3px; text-transform: capitalize;">${p.regType} entry</div>
                    </td>
                    <td>
                      ${roleBadgeHtml}
                    </td>
                    <td style="text-align: right;">
                      <button type="button" 
                              class="meal-toggle-btn ${isCollected ? 'collected' : ''}" 
                              onclick="handleMealToggle('${p.id}', this)">
                        ${isCollected ? '<span class="toggle-icon">✓</span> Collected' : '<span class="toggle-icon">○</span> Mark Collected'}
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  });

  eventSectionsContainer.innerHTML = html;
}

// ─── Accordion Toggle ───
function toggleAccordion(eventKey) {
  const container = document.getElementById(`event-sec-${eventKey}`);
  if (!container) return;

  if (expandedEventSections.has(eventKey)) {
    expandedEventSections.delete(eventKey);
    container.classList.remove('expanded');
  } else {
    expandedEventSections.add(eventKey);
    container.classList.add('expanded');
  }
}
window.toggleAccordion = toggleAccordion;

// Update event badge count in place without redrawing the whole accordion list
function updateEventBadgeCount(eventKey) {
  const badge = document.getElementById(`badge-${eventKey}`);
  const section = document.getElementById(`event-sec-${eventKey}`);
  if (!badge || !section) return;

  // Filter participants in this event
  const list = flatParticipants.filter(p => p.event === eventKey);
  const total = list.length;
  const collected = list.filter(p => {
    return activeMealTab === 'breakfast' ? p.collectedBreakfast : p.collectedLunch;
  }).length;

  const isAllCompleted = total > 0 && collected === total;
  badge.className = isAllCompleted ? "event-stats-badge completed" : "event-stats-badge";
  badge.textContent = isAllCompleted ? "✓ Completed" : `${collected} / ${total} Collected`;
}

// ─── Filters & Search Listeners ───
let searchDebounceTimeout = null;
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    renderFilteredList();
  }, 250);
});

eventFilter.addEventListener('change', renderFilteredList);
collectionFilter.addEventListener('change', renderFilteredList);

resetFiltersBtn.onclick = () => {
  searchInput.value = '';
  eventFilter.value = 'all';
  collectionFilter.value = 'all';
  renderFilteredList();
};

// ─── View Helpers ───
function showSection(section) {
  loginSection.style.display = section === 'login' ? 'block' : 'none';
  loadingSection.style.display = section === 'loading' ? 'block' : 'none';
  dashboardSection.style.display = section === 'dashboard' ? 'block' : 'none';
}

function showLoading(text) {
  showSection('loading');
  document.getElementById('loading-text').textContent = text;
  document.getElementById('loading-text').classList.remove('error-text');
  document.querySelector('.spinner').style.display = 'block';
}
