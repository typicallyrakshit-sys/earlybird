// ─── Admin Dashboard — NYDC 2026 ───
// Firebase init is INLINE to avoid file:// CORS issues with ES module imports

import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

import { 
    getFirestore, 
    collection, 
    getDocs,
    orderBy,
    query,
    doc,
    getDoc,
    updateDoc,
    deleteField,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ─── Firebase Init (inline, not imported) ───
const firebaseConfig = {
    apiKey: "AIzaSyDBo7RP1PSFhva-Ni0pKScX0MlIuUEAmnE",
    authDomain: "nydc-72b34.firebaseapp.com",
    projectId: "nydc-72b34",
    storageBucket: "nydc-72b34.firebasestorage.app",
    messagingSenderId: "935882112599",
    appId: "1:935882112599:web:f04b660e233f21a46f2d12",
    measurementId: "G-5G8Z44578K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ─── Initialize EmailJS ───
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: 'Vvw-ypTsbb2QHoiiX' });
}

// ─── ADMIN CONFIGURATION ───
const FALLBACK_ADMIN = "dhamindhankher2010@gmail.com";

async function isUserAdmin(email) {
    try {
        const adminRef = doc(db, 'settings', 'admins');
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
            const emails = adminSnap.data().emails || [];
            return emails.includes(email);
        }
    } catch (e) {
        console.error("Error fetching admin config:", e);
    }
    return email === FALLBACK_ADMIN;
}

const EVENT_NAMES = {
    mun: 'Model United Nations',
    moot_court: 'Moot Court',
    hackathon: 'Hackathon',
    debate: 'Conventional Debate',
    spark_tank: 'Spark Tank',
    marketing: 'Marketing',
    paper_trading: 'Paper Trading',
    film_making: 'Film Making',
    Navras: 'Navras',
    poetry: 'Poetry',
    raag_jaam: 'Raag Jaam',
    ipl: 'IPL Auction'
};

// ─── DOM ELEMENTS ───
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
let activeTab = 'individual'; // 'individual' | 'institutional'

// ─── AUTH STATE LOGIC ───
onAuthStateChanged(auth, async (user) => {
    if (user) {
        showLoading("Verifying admin access...");
        const isAdmin = await isUserAdmin(user.email);
        
        if (isAdmin) {
            showLoading("Fetching registration data...");
            await fetchRegistrations();
        } else {
            showLoading("Access Denied. You do not have admin privileges.");
            document.querySelector('.spinner').style.display = 'none';
            document.getElementById('loading-text').classList.add('error-text');
            setTimeout(() => signOut(auth), 3000);
        }
    } else {
        showLogin();
    }
});

// ─── FETCH DATA ───
async function fetchRegistrations() {
    try {
        // Individual registrations
        const regsRef = collection(db, "registrations");
        const q = query(regsRef, orderBy('registeredAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        registrationsData = [];
        querySnapshot.forEach((docSnap) => {
            registrationsData.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Institutional registrations
        try {
            const instRef = collection(db, "institutional_registrations");
            const instQ = query(instRef, orderBy('registeredAt', 'desc'));
            const instSnap = await getDocs(instQ);
            institutionalData = [];
            instSnap.forEach(docSnap => {
                institutionalData.push({ id: docSnap.id, ...docSnap.data() });
            });
        } catch (instErr) {
            console.warn('Could not fetch institutional registrations:', instErr);
            institutionalData = [];
        }

        // Sync IPL team reservations from existing registrations
        await syncIplTeams(registrationsData);

        renderCouponStats(registrationsData);
        renderTable(registrationsData);
        renderTabCounts();
        showDashboard();

    } catch (error) {
        console.error("Error fetching documents: ", error);
        showLoading("Failed to load data. See console for details.");
        document.querySelector('.spinner').style.display = 'none';
        document.getElementById('loading-text').classList.add('error-text');
    }
}

// ─── SYNC IPL TEAM RESERVATIONS ───
// Scans all existing registrations for IPL teams and writes
// them to settings/ipl_teams so the selection page can block taken teams.
async function syncIplTeams(dataArray) {
    try {
        const iplTeamsMap = {};
        dataArray.forEach(reg => {
            if (reg.event === 'ipl' && reg.iplTeam) {
                const status = (reg.status || '').toLowerCase();
                // Only block teams that are pending or approved (not rejected/draft)
                if (status === 'pending' || status === 'approved') {
                    iplTeamsMap[reg.iplTeam] = reg.id;
                }
            }
        });

        // Only write if there are IPL teams to sync
        if (Object.keys(iplTeamsMap).length > 0) {
            const iplTeamsRef = doc(db, 'settings', 'ipl_teams');
            // Overwrite the entire document to ensure rejected teams are cleared
            await setDoc(iplTeamsRef, iplTeamsMap);
            console.log('✅ IPL teams synced:', iplTeamsMap);
        }
    } catch (err) {
        console.warn('Could not sync IPL teams:', err);
    }
}

// ─── COUPON USAGE STATS ───
function renderCouponStats(dataArray) {
    // Count coupon usage
    const couponMap = {};
    dataArray.forEach(reg => {
        if (reg.couponApplied && reg.couponCode) {
            const code = reg.couponCode.toUpperCase();
            if (!couponMap[code]) {
                couponMap[code] = { count: 0, users: [] };
            }
            couponMap[code].count++;
            couponMap[code].users.push(`${reg.firstName} ${reg.lastName || ''}`);
        }
    });

    const codes = Object.keys(couponMap);
    if (codes.length === 0) {
        couponStatsSection.style.display = 'none';
        return;
    }

    couponStatsSection.style.display = 'block';

    // Sort by usage count (highest first)
    codes.sort((a, b) => couponMap[b].count - couponMap[a].count);

    let html = '';
    codes.forEach(code => {
        const info = couponMap[code];
        const userList = info.users.join(', ');
        html += `
            <div class="coupon-stat-card">
                <div class="coupon-stat-code">${code}</div>
                <div class="coupon-stat-count">${info.count}</div>
                <div class="coupon-stat-label">use${info.count > 1 ? 's' : ''}</div>
                <div class="coupon-stat-users" title="${userList}">${userList}</div>
            </div>
        `;
    });

    // Add a total card
    const totalCouponUses = codes.reduce((sum, c) => sum + couponMap[c].count, 0);
    html = `
        <div class="coupon-stat-card total-card">
            <div class="coupon-stat-code">TOTAL</div>
            <div class="coupon-stat-count">${totalCouponUses}</div>
            <div class="coupon-stat-label">coupon uses</div>
            <div class="coupon-stat-users">${codes.length} unique codes</div>
        </div>
    ` + html;

    couponStatsGrid.innerHTML = html;
}

// ─── TAB COUNT RENDER ───
function renderTabCounts() {
    const indTab = document.getElementById('tab-individual');
    const instTab = document.getElementById('tab-institutional');
    if (indTab) indTab.textContent = `Individual (${registrationsData.length})`;
    if (instTab) instTab.textContent = `Institutional (${institutionalData.length})`;
}

// Wire tab buttons if they exist in DOM
document.addEventListener('DOMContentLoaded', () => {
    const indTab = document.getElementById('tab-individual');
    const instTab = document.getElementById('tab-institutional');
    if (indTab) {
        indTab.addEventListener('click', () => {
            activeTab = 'individual';
            indTab.classList.add('active-tab');
            if (instTab) instTab.classList.remove('active-tab');
            renderTable(registrationsData);
        });
    }
    if (instTab) {
        instTab.addEventListener('click', () => {
            activeTab = 'institutional';
            instTab.classList.add('active-tab');
            if (indTab) indTab.classList.remove('active-tab');
            renderInstitutionalTable(institutionalData);
        });
    }
});

// ─── RENDER INSTITUTIONAL TABLE ───
function renderInstitutionalTable(dataArray) {
    const filterVal = statusFilter.value;
    let filtered = dataArray;
    if (filterVal !== 'all') {
        filtered = dataArray.filter(r => (r.status || 'pending') === filterVal);
    }

    const term = searchInput.value.toLowerCase();
    if (term) {
        filtered = filtered.filter(reg => {
            const coordName = `${reg.coordinatorFirst || ''} ${reg.coordinatorLast || ''}`.toLowerCase();
            return coordName.includes(term) ||
                   (reg.email && reg.email.toLowerCase().includes(term)) ||
                   (reg.institutionName && reg.institutionName.toLowerCase().includes(term)) ||
                   (reg.transactionId && reg.transactionId.toLowerCase().includes(term));
        });
    }

    totalCount.textContent = dataArray.length;
    pendingCount.textContent = dataArray.filter(r => (r.status || 'pending') === 'pending').length;
    approvedCount.textContent = dataArray.filter(r => r.status === 'approved').length;
    rejectedCount.textContent = dataArray.filter(r => r.status === 'rejected').length;

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">No institutional registrations found.</td></tr>`;
        return;
    }

    filtered.forEach(reg => {
        const row = document.createElement('tr');

        let dateStr = '—';
        if (reg.registeredAt) {
            const date = reg.registeredAt.toDate ? reg.registeredAt.toDate() : new Date(reg.registeredAt);
            dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        }

        const status = reg.status || 'pending';
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

        const priceHtml = reg.totalAmount
            ? `<span class="td-price">₹${reg.totalAmount.toLocaleString('en-IN')}</span>${reg.couponApplied && reg.couponCode ? `<span class="td-coupon">${reg.couponCode}</span>` : ''}`
            : '—';

        const txnHtml = reg.transactionId
            ? `<span class="td-txn">${reg.transactionId}</span>`
            : '<span style="color:var(--text-dimmed);font-size:0.75rem;">None</span>';

        const participantNames = (reg.participants || []).slice(0, 3)
            .map(p => `${p.firstName} ${p.lastName}`).join(', ');
        const moreCount = (reg.participants || []).length - 3;

        let actionsHtml = '';
        if (status === 'pending') {
            actionsHtml = `
                <button class="action-btn approve-btn" data-id="${reg.id}" data-type="institutional" title="Approve">✓ Approve</button>
                <button class="action-btn reject-btn" data-id="${reg.id}" data-type="institutional" title="Reject">✕ Reject</button>
            `;
        } else if (status === 'approved') {
            actionsHtml = `<span class="action-done">✓ Done</span>`;
        } else if (status === 'rejected') {
            actionsHtml = `<span class="action-done rejected-done">✕ Rejected</span>`;
        }

        row.innerHTML = `
            <td>
                <span class="td-name">${reg.coordinatorFirst || ''} ${reg.coordinatorLast || ''}</span>
                <span class="td-city" style="display:flex;align-items:center;gap:5px;">
                    <span style="background:rgba(59,130,246,0.15);color:#60a5fa;font-size:0.65rem;padding:1px 8px;border-radius:9999px;font-weight:600;letter-spacing:0.05em;">INSTITUTIONAL</span>
                    ${reg.institutionName || ''} · ${reg.institutionCity || ''}
                </span>
                <span class="td-city" style="margin-top:3px;font-size:0.7rem;color:var(--text-dimmed);">(${reg.participantCount || 0} participants)</span>
            </td>
            <td class="td-contact">
                <div><a href="mailto:${reg.email}">${reg.email}</a></div>
                <div style="margin-top: 4px;font-size:0.75rem;color:var(--text-dimmed);">${reg.phone || '—'}</div>
            </td>
            <td>
                <span class="event-badge" style="font-size:0.7rem;">${participantNames}${moreCount > 0 ? ` +${moreCount} more` : ''}</span>
                <span style="display:block;font-size:0.7rem;color:var(--text-dimmed);margin-top:4px;">${dateStr}</span>
            </td>
            <td>${priceHtml}</td>
            <td>${txnHtml}</td>
            <td><span class="status-badge ${status}">${statusLabel}</span></td>
            <td class="td-actions">${actionsHtml}</td>
        `;

        tableBody.appendChild(row);
    });

    // Approve buttons (institutional)
    document.querySelectorAll('.approve-btn[data-type="institutional"]').forEach(btn => {
        btn.addEventListener('click', () => handleInstitutionalAction(btn.dataset.id, 'approved'));
    });
    document.querySelectorAll('.reject-btn[data-type="institutional"]').forEach(btn => {
        btn.addEventListener('click', () => handleInstitutionalAction(btn.dataset.id, 'rejected'));
    });
}

// ─── INSTITUTIONAL APPROVE/REJECT HANDLER ───
async function handleInstitutionalAction(regId, newStatus) {
    const reg = institutionalData.find(r => r.id === regId);
    if (!reg) return;

    const actionLabel = newStatus === 'approved' ? 'approve' : 'reject';
    if (!confirm(`Are you sure you want to ${actionLabel} the registration for ${reg.institutionName}?`)) return;

    const btns = document.querySelectorAll(`[data-id="${regId}"]`);
    btns.forEach(b => { b.disabled = true; b.textContent = '…'; });

    try {
        const docRef = doc(db, 'institutional_registrations', regId);
        await updateDoc(docRef, { status: newStatus });
        reg.status = newStatus;
        renderInstitutionalTable(institutionalData);
    } catch (error) {
        console.error('Error updating institutional status:', error);
        alert('Failed to update status: ' + error.message);
        btns.forEach(b => { b.disabled = false; });
    }
}

// ─── RENDER TABLE ───
function renderTable(dataArray) {
    const filterVal = statusFilter.value;
    let filtered = dataArray.filter(r => (r.status || '').toLowerCase() !== 'draft');
    if (filterVal !== 'all') {
        filtered = filtered.filter(r => (r.status || 'pending').toLowerCase() === filterVal);
    }

    const term = searchInput.value.toLowerCase();
    if (term) {
        filtered = filtered.filter(reg => {
            const fullName = `${reg.firstName} ${reg.lastName || ''}`.toLowerCase();
            const evName = (EVENT_NAMES[reg.event] || reg.event).toLowerCase();
            return fullName.includes(term) || 
                   (reg.email && reg.email.toLowerCase().includes(term)) || 
                   evName.includes(term) ||
                   (reg.transactionId && reg.transactionId.toLowerCase().includes(term)) ||
                   (reg.couponCode && reg.couponCode.toLowerCase().includes(term)) ||
                   (reg.city && reg.city.toLowerCase().includes(term));
        });
    }

    const nonDraft = dataArray.filter(r => (r.status || '').toLowerCase() !== 'draft');
    totalCount.textContent = nonDraft.length;
    pendingCount.textContent = nonDraft.filter(r => ((r.status || '').toLowerCase() === 'pending' || r.status === undefined)).length;
    approvedCount.textContent = nonDraft.filter(r => (r.status || '').toLowerCase() === 'approved').length;
    rejectedCount.textContent = nonDraft.filter(r => (r.status || '').toLowerCase() === 'rejected').length;

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">No registrations found.</td></tr>`;
        return;
    }

    filtered.forEach(reg => {
        const row = document.createElement('tr');
        
        let dateStr = '—';
        if (reg.registeredAt) {
            const date = reg.registeredAt.toDate();
            dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        }

        const status = reg.status || 'pending';
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

        let priceHtml = '—';
        if (reg.price) {
            priceHtml = `<span class="td-price">₹${reg.price.toLocaleString('en-IN')}</span>`;
            if (reg.couponApplied && reg.couponCode) {
                priceHtml += `<span class="td-coupon">${reg.couponCode}</span>`;
            }
        }

        const txnHtml = reg.transactionId 
            ? `<span class="td-txn">${reg.transactionId}</span>` 
            : '<span style="color:var(--text-dimmed);font-size:0.75rem;">None</span>';

        let actionsHtml = '';
        if (status === 'pending') {
            actionsHtml = `
                <button class="action-btn approve-btn" data-id="${reg.id}" title="Approve">✓ Approve</button>
                <button class="action-btn reject-btn" data-id="${reg.id}" title="Reject">✕ Reject</button>
            `;
        } else if (status === 'approved') {
            actionsHtml = `<span class="action-done">✓ Done</span>`;
        } else if (status === 'rejected') {
            actionsHtml = `<span class="action-done rejected-done">✕ Rejected</span>`;
        }

        row.innerHTML = `
            <td>
                <span class="td-name">${reg.firstName} ${reg.lastName || ''}</span>
                <span class="td-city">${reg.school || '—'} · ${reg.city || ''}</span>
            </td>
            <td class="td-contact">
                <div><a href="mailto:${reg.email}">${reg.email}</a></div>
                <div style="margin-top: 4px;font-size:0.75rem;color:var(--text-dimmed);">${reg.phone || '—'}</div>
            </td>
            <td>
                <span class="event-badge">${EVENT_NAMES[reg.event] || reg.event}</span>
                <span style="display:block;font-size:0.7rem;color:var(--text-dimmed);margin-top:4px;">${dateStr}</span>
            </td>
            <td>${priceHtml}</td>
            <td>${txnHtml}</td>
            <td><span class="status-badge ${status}">${statusLabel}</span></td>
            <td class="td-actions">${actionsHtml}</td>
        `;

        tableBody.appendChild(row);
    });

    // Approve buttons
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', () => handleAction(btn.dataset.id, 'approved'));
    });

    // Reject buttons
    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', () => handleAction(btn.dataset.id, 'rejected'));
    });
}

// ─── APPROVE / REJECT HANDLER ───
async function handleAction(regId, newStatus) {
    const reg = registrationsData.find(r => r.id === regId);
    if (!reg) return;

    const actionLabel = newStatus === 'approved' ? 'approve' : 'reject';
    if (!confirm(`Are you sure you want to ${actionLabel} the registration for ${reg.firstName} ${reg.lastName || ''}?`)) {
        return;
    }

    const btns = document.querySelectorAll(`[data-id="${regId}"]`);
    btns.forEach(b => { b.disabled = true; b.textContent = '…'; });

    try {
        const docRef = doc(db, 'registrations', regId);
        await updateDoc(docRef, { status: newStatus });

        // ─── IPL Team: release team on rejection ───
        if (newStatus === 'rejected' && reg.event === 'ipl' && reg.iplTeam) {
            try {
                const iplTeamsRef = doc(db, 'settings', 'ipl_teams');
                await updateDoc(iplTeamsRef, { [reg.iplTeam]: deleteField() });
                console.log('IPL team released:', reg.iplTeam);
            } catch (iplErr) {
                console.warn('Could not release IPL team:', iplErr);
            }
        }

        // Send email notification
        if (typeof emailjs !== 'undefined') {
            const eventName = EVENT_NAMES[reg.event] || reg.event;

            if (newStatus === 'approved') {
                try {
                    await emailjs.send('service_1fxd5y7', 'template_09rbyci', {
                        to_name:         reg.firstName + ' ' + (reg.lastName || ''),
                        to_email:        reg.email,
                        event_name:      eventName,
                        team_size:       reg.teamSize || 1,
                        team_members:    (reg.teamMembers || []).map((m, i) => `${i+1}. ${m.firstName} ${m.lastName} (${m.email})`).join('\n'),
                        registration_id: regId,
                        school:          reg.school || '',
                        city:            reg.city || ''
                    });
                    console.log('Approval email sent');
                } catch (emailErr) { console.warn('Approval email failed:', emailErr); }
            } else {
                try {
                    await emailjs.send('service_1fxd5y7', 'template_09rbyci', {
                        to_name:         reg.firstName + ' ' + (reg.lastName || ''),
                        to_email:        reg.email,
                        event_name:      eventName + ' — REGISTRATION REJECTED',
                        team_size:       reg.teamSize || 1,
                        team_members:    'Your registration has been rejected. Payment could not be verified. Contact us if this is an error.',
                        registration_id: regId,
                        school:          reg.school || '',
                        city:            reg.city || ''
                    });
                    console.log('Rejection email sent');
                } catch (emailErr) { console.warn('Rejection email failed:', emailErr); }
            }
        }

        reg.status = newStatus;
        renderCouponStats(registrationsData);
        renderTable(registrationsData);

    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status: ' + error.message);
        btns.forEach(b => { b.disabled = false; });
    }
}

// ─── SEARCH & FILTER ───
searchInput.addEventListener('input', () => renderTable(registrationsData));
statusFilter.addEventListener('change', () => renderTable(registrationsData));

// ─── LOGIN & LOGOUT ───
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;

    loginBtn.disabled = true;
    loginBtn.textContent = 'Verifying...';

    const isAdmin = await isUserAdmin(email);
    if (!isAdmin) {
        loginError.textContent = "This email is not authorized for admin access.";
        loginBtn.disabled = false;
        loginBtn.textContent = 'Log In →';
        return;
    }

    loginBtn.textContent = 'Logging in...';

    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Log In →';
        let msg = 'Login failed.';
        if (error.code === 'auth/invalid-credential') msg = 'Incorrect email or password.';
        else if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
        loginError.textContent = msg;
    }
});

logoutBtn.addEventListener('click', () => signOut(auth));

// Toggle Password Visibility
const toggleBtn = document.querySelector('.password-toggle');
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const input = document.getElementById(toggleBtn.getAttribute('data-target'));
        const isPass = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPass ? 'text' : 'password');
        toggleBtn.querySelector('.eye-icon').style.display = isPass ? 'none' : 'block';
        toggleBtn.querySelector('.eye-off-icon').style.display = isPass ? 'block' : 'none';
    });
}

// ─── VIEW HELPERS ───
function showLogin() {
    loginSection.style.display = 'block';
    loadingSection.style.display = 'none';
    dashboardSection.style.display = 'none';
}

function showLoading(text) {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-text').classList.remove('error-text');
    document.querySelector('.spinner').style.display = 'block';
    loginSection.style.display = 'none';
    loadingSection.style.display = 'block';
    dashboardSection.style.display = 'none';
}

function showDashboard() {
    loginSection.style.display = 'none';
    loadingSection.style.display = 'none';
    dashboardSection.style.display = 'block';
}

console.log('✅ Admin JS loaded successfully');
