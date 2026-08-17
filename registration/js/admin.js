/**
 * Admin Dashboard Logic — Consolidated
 * Standardized Event Names & Improved Email Handling
 */
import { auth, db, EVENT_NAMES } from './firebase.js';
import { 
  signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { 
  collection, getDocs, orderBy, query, doc, getDoc, updateDoc, setDoc 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// DOM Elements
const loginSection = document.getElementById('login-section');
const loadingSection = document.getElementById('loading-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const totalCount = document.getElementById('total-count');
const pendingCount = document.getElementById('pending-count');
const approvedCount = document.getElementById('approved-count');
const rejectedCount = document.getElementById('rejected-count');
const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const couponStatsSection = document.getElementById('coupon-stats-section');
const couponStatsGrid = document.getElementById('coupon-stats-grid');

let registrationsData = [];
let institutionalData = [];
let activeTab = 'individual';

// ─── Admin Access ───
const FALLBACK_ADMIN = "dhamindhankher2010@gmail.com";
async function isUserAdmin(email) {
  try {
    const snap = await getDoc(doc(db, 'settings', 'admins'));
    if (snap.exists() && snap.data().emails) return snap.data().emails.includes(email);
  } catch(e) { console.error("Admin check err:", e); }
  return email === FALLBACK_ADMIN;
}

// ─── Auth State ───
let authResolved = false;
setTimeout(() => { if (!authResolved) { showLogin(); } }, 5000);

onAuthStateChanged(auth, async (user) => {
  authResolved = true;
  if (user) {
    showLoading("Verifying admin access...");
    if (await isUserAdmin(user.email)) {
      showLoading("Fetching data...");
      await fetchRegistrations();
    } else {
      showLoading("Access Denied.");
      document.querySelector('.spinner').style.display = 'none';
      document.getElementById('loading-text').classList.add('error-text');
      setTimeout(() => signOut(auth), 3000);
    }
  } else { showLogin(); }
});

// ─── Data Fetching ───
async function fetchRegistrations() {
  try {
    // Individual registrations
    const q = query(collection(db, "registrations"));
    const snap = await getDocs(q);
    registrationsData = [];
    snap.forEach(d => registrationsData.push({ id: d.id, ...d.data() }));
    registrationsData.sort((a, b) => {
      const tA = (a.registeredAt || a.createdAt)?.toMillis() || 0;
      const tB = (b.registeredAt || b.createdAt)?.toMillis() || 0;
      return tB - tA;
    });

    // Institutional registrations
    try {
      const iq = query(collection(db, "institutional_registrations"), orderBy('registeredAt', 'desc'));
      const isnap = await getDocs(iq);
      institutionalData = [];
      isnap.forEach(d => institutionalData.push({ id: d.id, ...d.data() }));
    } catch(ie) { console.warn('Institutional fetch err:', ie); institutionalData = []; }

    // Update tab counts
    document.getElementById('tab-individual').textContent  = `Individual (${registrationsData.length})`;
    document.getElementById('tab-institutional').textContent = `Institutional (${institutionalData.length})`;

    renderCouponStats(registrationsData);
    if (activeTab === 'individual') renderTable(registrationsData);
    else renderInstitutionalTable(institutionalData);
    showDashboard();
  } catch (error) {
    console.error("Fetch err:", error);
    showLoading("Failed to load data: " + error.message);
    document.querySelector('.spinner').style.display = 'none';
    document.getElementById('loading-text').classList.add('error-text');
  }
}

// ─── Rendering Logic ───
function renderCouponStats(data) {
  const map = {};
  data.forEach(r => {
    if (r.status === 'rejected') return;
    if (r.couponApplied && r.couponCode) {
      const c = r.couponCode.toUpperCase();
      if (!map[c]) map[c] = { count: 0, users: [] };
      map[c].count++;
      map[c].users.push(`${r.firstName} ${r.lastName||''}`);
    }
  });
  const codes = Object.keys(map);
  if (!codes.length) { couponStatsSection.style.display = 'none'; return; }
  couponStatsSection.style.display = 'block';
  codes.sort((a,b) => map[b].count - map[a].count);
  const total = codes.reduce((s,c) => s + map[c].count, 0);
  let html = `<div class="coupon-stat-card total-card"><div class="coupon-stat-code">TOTAL</div><div class="coupon-stat-count">${total}</div><div class="coupon-stat-label">coupon uses</div><div class="coupon-stat-users">${codes.length} unique codes</div></div>`;
  codes.forEach(c => {
    html += `<div class="coupon-stat-card"><div class="coupon-stat-code">${c}</div><div class="coupon-stat-count">${map[c].count}</div><div class="coupon-stat-label">use${map[c].count>1?'s':''}</div><div class="coupon-stat-users" title="${map[c].users.join(', ')}">${map[c].users.join(', ')}</div></div>`;
  });
  couponStatsGrid.innerHTML = html;
}

function renderTable(dataArray) {
  const fv = statusFilter.value;
  let filtered = fv === 'all' ? dataArray : dataArray.filter(r => (r.status||'pending') === fv);
  const term = searchInput.value.toLowerCase();
  if (term) {
    filtered = filtered.filter(r => {
      const n = `${r.firstName} ${r.lastName||''}`.toLowerCase();
      return n.includes(term) || (r.email||'').toLowerCase().includes(term) || (EVENT_NAMES[r.event]||r.event).toLowerCase().includes(term) || (r.transactionId||'').toLowerCase().includes(term) || (r.couponCode||'').toLowerCase().includes(term) || (r.city||'').toLowerCase().includes(term);
    });
  }
  totalCount.textContent = dataArray.length;
  pendingCount.textContent = dataArray.filter(r => (r.status||'pending') === 'pending').length;
  approvedCount.textContent = dataArray.filter(r => r.status === 'approved').length;
  rejectedCount.textContent = dataArray.filter(r => r.status === 'rejected').length;
  
  // Re-enable table-container scroll
  document.querySelector('.table-container').style.overflowX = 'auto';
  tableBody.innerHTML = '';
  if (!filtered.length) { tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">No registrations found.</td></tr>`; return; }

  filtered.forEach(reg => {
    const row = document.createElement('tr');
    let dateStr = '—';
    if (reg.registeredAt) { try { dateStr = reg.registeredAt.toDate().toLocaleDateString('en-IN',{day:'2-digit',month:'short'}); } catch(e){} }
    const status = reg.status || 'pending';
    let priceHtml = reg.price ? `<span class="td-price">₹${reg.price.toLocaleString('en-IN')}</span>` : '—';
    if (reg.couponApplied && reg.couponCode) priceHtml += `<span class="td-coupon">${reg.couponCode}</span>`;
    const txnHtml = reg.transactionId ? `<span class="td-txn">${reg.transactionId}</span>` : '<span style="color:var(--text-dimmed);font-size:0.75rem;">None</span>';
    let actionsHtml = '';
    if (status === 'pending') actionsHtml = `<button class="action-btn approve-btn" data-id="${reg.id}">✓ Approve</button><button class="action-btn reject-btn" data-id="${reg.id}">✕ Reject</button>`;
    else if (status === 'approved') actionsHtml = `<span class="action-done">✓ Done</span>`;
    else actionsHtml = `<span class="action-done rejected-done">✕ Rejected</span>`;

    row.innerHTML = `
      <td><span class="td-name">${reg.firstName} ${reg.lastName||''}</span><span class="td-city">${reg.school||'—'} · ${reg.city||''}</span></td>
      <td class="td-contact"><div><a href="mailto:${reg.email}">${reg.email}</a></div><div style="margin-top:4px;font-size:0.75rem;color:var(--text-dimmed);">${reg.phone||'—'}</div></td>
      <td><span class="event-badge">${EVENT_NAMES[reg.event]||reg.event}</span><span style="display:block;font-size:0.7rem;color:var(--text-dimmed);margin-top:4px;">${dateStr}</span></td>
      <td>${priceHtml}</td>
      <td>${txnHtml}</td>
      <td><span class="status-badge ${status}">${status.charAt(0).toUpperCase()+status.slice(1)}</span></td>
      <td class="td-actions">${actionsHtml}</td>`;
    tableBody.appendChild(row);
  });

  document.querySelectorAll('.approve-btn:not([data-coll])').forEach(b => b.addEventListener('click', () => handleAction(b.dataset.id, 'approved')));
  document.querySelectorAll('.reject-btn:not([data-coll])').forEach(b => b.addEventListener('click', () => handleAction(b.dataset.id, 'rejected')));
}

function renderInstitutionalTable(dataArray) {
  const fv   = statusFilter.value;
  const term = searchInput.value.toLowerCase();

  let filtered = dataArray.filter(r => r.status !== 'draft');
  if (fv !== 'all') filtered = filtered.filter(r => (r.status||'pending') === fv);
  if (term) {
    filtered = filtered.filter(r =>
      (`${r.coordinatorFirst||''} ${r.coordinatorLast||''}`).toLowerCase().includes(term) ||
      (r.email||'').toLowerCase().includes(term) ||
      (r.institutionName||'').toLowerCase().includes(term) ||
      (r.transactionId||'').toLowerCase().includes(term) ||
      (r.participants||[]).some(p =>
        (`${p.firstName||''} ${p.lastName||''}`).toLowerCase().includes(term) ||
        (EVENT_NAMES[p.event]||p.event||'').toLowerCase().includes(term)
      )
    );
  }

  const nonDraft = dataArray.filter(r => r.status !== 'draft');
  totalCount.textContent    = nonDraft.length;
  pendingCount.textContent  = nonDraft.filter(r => (r.status||'pending') === 'pending').length;
  approvedCount.textContent = nonDraft.filter(r => r.status === 'approved').length;
  rejectedCount.textContent = nonDraft.filter(r => r.status === 'rejected').length;

  const container = document.querySelector('.table-container');
  container.style.overflowX = 'unset';
  tableBody.innerHTML = '';

  if (!filtered.length) {
    container.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--text-muted);font-family:'Outfit',sans-serif;">No institutional registrations found.</div>`;
    return;
  }

  const SC = {
    pending:  { bg:'rgba(234,179,8,0.12)',  border:'rgba(234,179,8,0.3)',  color:'#eab308', label:'Pending'  },
    approved: { bg:'rgba(34,197,94,0.12)', border:'rgba(34,197,94,0.3)',  color:'#22c55e', label:'Approved' },
    rejected: { bg:'rgba(239,68,68,0.12)', border:'rgba(239,68,68,0.3)',  color:'#ef4444', label:'Rejected' }
  };

  const cardsHtml = filtered.map(reg => {
    const status  = reg.status || 'pending';
    const sc      = SC[status] || SC.pending;
    const dateStr = reg.registeredAt ? (() => { try { return reg.registeredAt.toDate().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); } catch(e){return '—';} })() : '—';
    const participants = reg.participants || [];

    const pRows = participants.map((p, idx) => {
      const evName = EVENT_NAMES[p.event] || p.event || '—';
      let subInfo = '';
      if (p.event === 'mun' && p.munCommittee) {
        subInfo = `<div style="font-size:0.68rem;color:#9ca3af;margin-top:3px;">${p.munCommittee} &mdash; ${p.munPortfolio||'No portfolio'}</div>`;
      } else if (p.event === 'ipl' && p.iplTeam) {
        subInfo = `<div style="font-size:0.68rem;color:#9ca3af;margin-top:3px;">🏏 ${p.iplTeam}</div>`;
      }
      const pPrice = p.price != null ? `₹${(+p.price).toLocaleString('en-IN')}` : '—';
      return `<tr style="border-top:1px solid rgba(255,255,255,0.05);">
        <td style="padding:9px 14px;font-family:'Outfit',sans-serif;font-size:0.82rem;color:#e5e7eb;">${idx+1}. ${p.firstName||''} ${p.lastName||''}</td>
        <td style="padding:9px 14px;font-family:'Outfit',sans-serif;font-size:0.78rem;color:#9ca3af;">${p.grade||'—'}</td>
        <td style="padding:9px 14px;">
          <span style="background:rgba(139,26,26,0.2);color:#f87171;font-family:'Outfit',sans-serif;font-size:0.72rem;font-weight:600;padding:3px 10px;border-radius:9999px;">${evName}</span>
          ${subInfo}
        </td>
        <td style="padding:9px 14px;font-family:'Space Mono',monospace;font-size:0.78rem;color:#d1d5db;">${pPrice}</td>
      </tr>`;
    }).join('');

    let actHtml = '';
    if (status === 'pending') {
      actHtml = `<button class="action-btn approve-btn" data-id="${reg.id}" data-coll="institutional">✓ Approve</button>
                 <button class="action-btn reject-btn"  data-id="${reg.id}" data-coll="institutional">✕ Reject</button>`;
    } else if (status === 'approved') {
      actHtml = `<span class="action-done">✓ Approved</span>`;
    } else {
      actHtml = `<span class="action-done rejected-done">✕ Rejected</span>`;
    }

    return `
    <div style="background:rgba(10,5,5,0.7);border:1px solid rgba(255,255,255,0.08);border-radius:14px;margin-bottom:16px;overflow:hidden;" class="inst-admin-card">
      <div style="padding:18px 20px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;cursor:pointer;" onclick="var p=this.nextElementSibling.nextElementSibling;p.style.maxHeight=p.style.maxHeight?'':'4000px'">
        <div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
            <span style="background:rgba(59,130,246,0.15);color:#60a5fa;font-family:'Outfit',sans-serif;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;padding:2px 10px;border-radius:9999px;">INSTITUTIONAL</span>
            <span style="background:${sc.bg};border:1px solid ${sc.border};color:${sc.color};font-family:'Outfit',sans-serif;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;padding:2px 10px;border-radius:9999px;">${sc.label.toUpperCase()}</span>
            <span style="font-family:'Space Mono',monospace;font-size:0.62rem;color:#6b7280;">${dateStr}</span>
          </div>
          <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;color:#fff;margin:0 0 3px;">${reg.institutionName||'Unknown Institution'}</h3>
          <div style="font-family:'Outfit',sans-serif;font-size:0.76rem;color:#9ca3af;">${reg.institutionCity||''} &middot; ${reg.institutionType||''}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;color:#fff;">₹${(reg.totalAmount||0).toLocaleString('en-IN')}</div>
          <div style="font-family:'Outfit',sans-serif;font-size:0.72rem;color:#9ca3af;">${participants.length} participant${participants.length!==1?'s':''} &bull; click to expand</div>
        </div>
      </div>

      <div style="padding:10px 20px;background:rgba(255,255,255,0.025);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between;">
        <div style="display:flex;flex-wrap:wrap;gap:20px;">
          <div><div style="font-family:'Outfit',sans-serif;font-size:0.62rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;">Coordinator</div><div style="font-family:'Outfit',sans-serif;font-size:0.82rem;color:#e5e7eb;">${reg.coordinatorFirst||''} ${reg.coordinatorLast||''}</div></div>
          <div><div style="font-family:'Outfit',sans-serif;font-size:0.62rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;">Email</div><div><a href="mailto:${reg.email}" style="font-family:'Outfit',sans-serif;font-size:0.82rem;color:#93c5fd;text-decoration:none;">${reg.email||'—'}</a></div></div>
          <div><div style="font-family:'Outfit',sans-serif;font-size:0.62rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;">Phone</div><div style="font-family:'Outfit',sans-serif;font-size:0.82rem;color:#e5e7eb;">${reg.phone||'—'}</div></div>
          <div><div style="font-family:'Outfit',sans-serif;font-size:0.62rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;">Txn ID</div><div style="font-family:'Space Mono',monospace;font-size:0.75rem;color:${reg.transactionId?'#d1d5db':'#4b5563'};">${reg.transactionId||'—'}</div></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">${actHtml}</div>
      </div>

      <div style="max-height:0;overflow:hidden;transition:max-height 0.4s ease;">
        <div style="padding:16px 20px;">
          <table style="width:100%;border-collapse:collapse;border:1px solid rgba(255,255,255,0.07);border-radius:8px;overflow:hidden;">
            <thead><tr style="background:rgba(255,255,255,0.04);">
              <th style="padding:8px 14px;text-align:left;font-family:'Outfit',sans-serif;font-size:0.62rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.12em;">Participant</th>
              <th style="padding:8px 14px;text-align:left;font-family:'Outfit',sans-serif;font-size:0.62rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.12em;">Grade</th>
              <th style="padding:8px 14px;text-align:left;font-family:'Outfit',sans-serif;font-size:0.62rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.12em;">Event</th>
              <th style="padding:8px 14px;text-align:left;font-family:'Outfit',sans-serif;font-size:0.62rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.12em;">Price</th>
            </tr></thead>
            <tbody>${pRows}</tbody>
          </table>
        </div>
      </div>
    </div>`;
  }).join('');

  container.innerHTML = cardsHtml;
  document.querySelectorAll('.approve-btn[data-coll="institutional"]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); handleInstAction(b.dataset.id, 'approved'); }));
  document.querySelectorAll('.reject-btn[data-coll="institutional"]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); handleInstAction(b.dataset.id, 'rejected'); }));
}

// ─── Actions & Email ───
async function sendNotification(toName, toEmail, eventName, status, extra) {
  if (typeof emailjs === 'undefined') return;
  
  const isRejected = status === 'rejected';
  const emailParams = {
    to_name:         toName,
    to_email:        toEmail,
    event_name:      isRejected ? `${eventName} — Update on your registration` : eventName,
    team_size:       extra.teamSize || 1,
    team_members:    isRejected ? 
      "We regret to inform you that your registration could not be confirmed at this time. This is typically due to an unverified transaction or missing payment details.\n\nIf you believe this is an error, please contact our support team." : 
      extra.teamMembers,
    registration_id: extra.id,
    school:          extra.school || '',
    city:            extra.city || ''
  };

  try {
    await emailjs.send('service_1fxd5y7', 'template_09rbyci', emailParams);
    console.log(`Email sent to ${toEmail}`);
  } catch(e) { console.warn('Email failed:', e); }
}

async function handleAction(regId, newStatus) {
  const reg = registrationsData.find(r => r.id === regId);
  if (!reg) return;
  if (!confirm(`${newStatus === 'approved' ? 'Approve' : 'Reject'} individual registration for ${reg.firstName}?`)) return;
  
  const btns = document.querySelectorAll(`[data-id="${regId}"]`);
  btns.forEach(b => { b.disabled = true; b.textContent = '…'; });

  try {
    await updateDoc(doc(db, 'registrations', regId), { status: newStatus });
    
    const teamList = (reg.teamMembers||[]).map((m,i) => `${i+1}. ${m.firstName} ${m.lastName} (${m.email})`).join('\n');
    await sendNotification(
      reg.firstName + ' ' + (reg.lastName||''),
      reg.email,
      EVENT_NAMES[reg.event] || reg.event,
      newStatus,
      { teamSize: reg.teamSize, teamMembers: teamList, id: regId, school: reg.school, city: reg.city }
    );

    reg.status = newStatus;
    renderCouponStats(registrationsData);
    renderTable(registrationsData);
  } catch (error) {
    alert('Failed: ' + error.message);
    btns.forEach(b => { b.disabled = false; });
  }
}

async function handleInstAction(regId, newStatus) {
  const reg = institutionalData.find(r => r.id === regId);
  if (!reg) return;
  if (!confirm(`${newStatus === 'approved' ? 'Approve' : 'Reject'} institutional registration for ${reg.institutionName}?`)) return;

  const btns = document.querySelectorAll(`[data-id="${regId}"]`);
  btns.forEach(b => { b.disabled = true; b.textContent = '…'; });

  try {
    await updateDoc(doc(db, 'institutional_registrations', regId), { status: newStatus });
    
    const participantsList = (reg.participants||[]).map((p,i) => `${i+1}. ${p.firstName} ${p.lastName} (${EVENT_NAMES[p.event]||p.event})`).join('\n');
    await sendNotification(
      reg.coordinatorFirst + ' ' + (reg.coordinatorLast||''),
      reg.email,
      'Institutional Registration',
      newStatus,
      { teamSize: (reg.participants||[]).length, teamMembers: participantsList, id: regId, school: reg.institutionName, city: reg.institutionCity }
    );

    reg.status = newStatus;
    renderInstitutionalTable(institutionalData);
  } catch(err) { 
    alert('Failed: ' + err.message); 
    btns.forEach(b => { b.disabled = false; }); 
  }
}

// ─── Registration Toggle ───
const regToggle = document.getElementById('reg-toggle');
const regToggleLabel = document.getElementById('reg-toggle-label');

async function loadRegistrationStatus() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'registration'));
    const isOpen = snap.exists() ? snap.data().isOpen !== false : true;
    regToggle.checked = isOpen;
    updateToggleLabel(isOpen);
  } catch (e) {
    console.error('Failed to load registration status:', e);
    regToggle.checked = true;
    updateToggleLabel(true);
  }
}

function updateToggleLabel(isOpen) {
  regToggleLabel.textContent = isOpen ? 'Open' : 'Closed';
  regToggleLabel.style.color = isOpen ? '#22c55e' : '#ef4444';
  const wrapper = document.getElementById('reg-toggle-wrapper');
  wrapper.style.borderColor = isOpen ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
}

regToggle.addEventListener('change', async () => {
  const isOpen = regToggle.checked;
  updateToggleLabel(isOpen);
  try {
    await setDoc(doc(db, 'settings', 'registration'), { isOpen }, { merge: true });
    console.log(`Registration ${isOpen ? 'opened' : 'closed'}`);
  } catch (e) {
    console.error('Failed to update registration status:', e);
    // Revert toggle on failure
    regToggle.checked = !isOpen;
    updateToggleLabel(!isOpen);
    alert('Failed to update registration status: ' + e.message);
  }
});

// ─── UI Utilities ───
window.switchTab = function(tab) {
  activeTab = tab;
  const indBtn  = document.getElementById('tab-individual');
  const instBtn = document.getElementById('tab-institutional');
  if (tab === 'individual') {
    indBtn.style.background  = 'rgba(139,26,26,0.9)'; indBtn.style.color  = '#fff'; indBtn.style.borderColor  = '#8b1a1a';
    instBtn.style.background = 'rgba(255,255,255,0.05)'; instBtn.style.color = '#9ca3af'; instBtn.style.borderColor = 'rgba(255,255,255,0.1)';
    renderTable(registrationsData);
  } else {
    instBtn.style.background = 'rgba(59,130,246,0.8)'; instBtn.style.color = '#fff'; instBtn.style.borderColor = '#3b82f6';
    indBtn.style.background  = 'rgba(255,255,255,0.05)'; indBtn.style.color = '#9ca3af'; indBtn.style.borderColor = 'rgba(255,255,255,0.1)';
    renderInstitutionalTable(institutionalData);
  }
};

searchInput.addEventListener('input', () => activeTab === 'individual' ? renderTable(registrationsData) : renderInstitutionalTable(institutionalData));
statusFilter.addEventListener('change', () => activeTab === 'individual' ? renderTable(registrationsData) : renderInstitutionalTable(institutionalData));
logoutBtn.addEventListener('click', () => signOut(auth));

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  loginBtn.disabled = true; loginBtn.textContent = 'Verifying...';
  const admin = await isUserAdmin(email);
  if (!admin) { loginError.textContent = "Not authorized."; loginBtn.disabled = false; loginBtn.textContent = 'Log In →'; return; }
  try { await signInWithEmailAndPassword(auth, email, pass); }
  catch(err) { loginBtn.disabled = false; loginBtn.textContent = 'Log In →'; loginError.textContent = 'Login failed.'; }
});

// Password Toggle
const toggleBtn = document.querySelector('.password-toggle');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const inp = document.getElementById(toggleBtn.getAttribute('data-target'));
    const isPass = inp.type === 'password';
    inp.type = isPass ? 'text' : 'password';
    toggleBtn.querySelector('.eye-icon').style.display = isPass ? 'none' : 'block';
    toggleBtn.querySelector('.eye-off-icon').style.display = isPass ? 'block' : 'none';
  });
}

// CSV Download
const downloadUnpaidBtn = document.getElementById('download-unpaid-btn');
if (downloadUnpaidBtn) {
  downloadUnpaidBtn.addEventListener('click', () => {
    const unpaidIndiv = registrationsData.filter(r => r.status === 'draft');
    if (unpaidIndiv.length === 0) { alert("No unpaid individual registrations found."); return; }
    let csvContent = "First Name,Last Name,Email,Phone,School/Institution,City,Date\n";
    unpaidIndiv.forEach(r => {
      const dateObj = r.createdAt || r.registeredAt;
      const dateStr = dateObj ? (dateObj.toDate ? dateObj.toDate().toLocaleDateString('en-IN') : new Date(dateObj).toLocaleDateString('en-IN')) : 'N/A';
      csvContent += `"${r.firstName || ''}","${r.lastName || ''}","${r.email || ''}","${r.phone || ''}","${r.school || ''}","${r.city || ''}",${dateStr}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "NYDC2026_Unpaid_Individual.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

function showLogin() { loginSection.style.display = 'block'; loadingSection.style.display = 'none'; dashboardSection.style.display = 'none'; }
function showLoading(t) { document.getElementById('loading-text').textContent = t; document.getElementById('loading-text').classList.remove('error-text'); document.querySelector('.spinner').style.display = 'block'; loginSection.style.display = 'none'; loadingSection.style.display = 'block'; dashboardSection.style.display = 'none'; }
function showDashboard() { loginSection.style.display = 'none'; loadingSection.style.display = 'none'; dashboardSection.style.display = 'block'; loadRegistrationStatus(); }
