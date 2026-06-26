/**
 * Selection Page Logic — Consolidated
 * Handles Step 3 of registration (Team Details & Payment)
 */
import { auth, db } from './firebase.js';
import { 
  collection, addDoc, updateDoc, doc, getDoc, setDoc, getDocs, query, where, deleteDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const form = document.getElementById('team-form');
if (!form) {
  console.error('team-form not found');
} else {
  const submitBtn = form.querySelector('.submit-btn');

  // Pull stored data
  const storedPersonal = sessionStorage.getItem('nydc_registration');
  const storedEvent    = sessionStorage.getItem('nydc_event');
  const storedMun      = sessionStorage.getItem('nydc_mun_selection');
  const storedCoupon   = sessionStorage.getItem('nydc_coupon');

  if (!storedPersonal || !storedEvent) {
    window.location.href = '../registration.html';
    return;
  }

  const personalData  = JSON.parse(storedPersonal);
  const evData        = JSON.parse(storedEvent);
  const munPortfolios = storedMun ? JSON.parse(storedMun) : null;
  const couponInfo    = storedCoupon ? JSON.parse(storedCoupon) : null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate transaction ID
    const txnInput = document.getElementById('transaction-id');
    const transactionId = txnInput ? txnInput.value.trim() : '';
    if (!transactionId) {
      alert('Please enter your UPI Transaction ID before submitting.');
      if (txnInput) txnInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    // Gather team members
    const memberCards = document.querySelectorAll('.member-card');
    const teamMembers = [];
    memberCards.forEach((card, i) => {
      const idx = card.dataset.index;
      teamMembers.push({
        firstName: (card.querySelector(`input[name="member_first_${idx}"]`) || {}).value?.trim() || '',
        lastName:  (card.querySelector(`input[name="member_last_${idx}"]`) || {}).value?.trim() || '',
        email:     (card.querySelector(`input[name="member_email_${idx}"]`) || {}).value?.trim() || '',
        phone:     (card.querySelector(`input[name="member_phone_${idx}"]`) || {}).value?.trim() || '',
        school:    (card.querySelector(`input[name="member_school_${idx}"]`) || {}).value?.trim() || '',
        role:      i === 0 ? 'leader' : 'member'
      });
    });

    // IPL Team
    let iplTeam = null;
    if (evData.event === 'ipl') {
      const sel = form.querySelector('input[name="ipl_team"]:checked');
      iplTeam = sel ? sel.value : null;
      if (!iplTeam) {
        alert('Please select an IPL franchise to represent before submitting.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register Now';
        return;
      }
    }

    try {
      // ─── IPL Team: verify still available ───
      if (iplTeam) {
        const iplTeamsRef = doc(db, 'settings', 'ipl_teams');
        const iplTeamsSnap = await getDoc(iplTeamsRef);
        if (iplTeamsSnap.exists() && iplTeamsSnap.data()[iplTeam]) {
          // If the team is taken by someone else (not the current user's draft)
          if (iplTeamsSnap.data()[iplTeam] !== sessionStorage.getItem('nydc_doc_id')) {
            alert('Sorry, ' + iplTeam + ' has just been taken by another registrant.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register Now';
            return;
          }
        }
      }

      const registrationData = {
        uid:           personalData.uid || null,
        firstName:     personalData.firstName,
        lastName:      personalData.lastName,
        email:         personalData.email,
        phone:         personalData.phone,
        school:        personalData.school,
        grade:         personalData.grade,
        city:          personalData.city,
        event:         evData.event,
        experience:    evData.experience,
        munPortfolios: munPortfolios,
        iplTeam:       iplTeam,
        price:         evData.price || null,
        couponApplied: couponInfo ? couponInfo.applied : false,
        couponCode:    couponInfo ? couponInfo.code : null,
        transactionId: transactionId,
        status:        'pending',
        teamSize:      teamMembers.length,
        teamMembers:   teamMembers,
        registeredAt:  serverTimestamp()
      };

      let FinalDocId = null;
      const storedDocId = sessionStorage.getItem('nydc_doc_id');

      if (storedDocId) {
        // Update existing draft
        const draftRef = doc(db, 'registrations', storedDocId);
        await updateDoc(draftRef, registrationData);
        FinalDocId = storedDocId;
      } else {
        // Create new doc
        const docRef = await addDoc(collection(db, 'registrations'), registrationData);
        FinalDocId = docRef.id;
      }

      // ─── IPL Team Reservation ───
      if (iplTeam) {
        try {
          const iplTeamsRef = doc(db, 'settings', 'ipl_teams');
          await setDoc(iplTeamsRef, { [iplTeam]: FinalDocId }, { merge: true });
        } catch (iplErr) { console.warn('IPL reservation failed:', iplErr); }
      }

      // ─── Cleanup: delete other drafts for this UID ───
      try {
        const uid = registrationData.uid;
        if (uid) {
          const draftsQ = query(collection(db, 'registrations'), where('uid', '==', uid), where('status', '==', 'draft'));
          const draftsSnap = await getDocs(draftsQ);
          for (const draftDoc of draftsSnap.docs) {
            if (draftDoc.id !== FinalDocId) {
              await deleteDoc(doc(db, 'registrations', draftDoc.id));
            }
          }
        }
      } catch (cleanupErr) { console.warn('Draft cleanup failed:', cleanupErr); }

      // Clear session
      sessionStorage.removeItem('nydc_registration');
      sessionStorage.removeItem('nydc_event');
      sessionStorage.removeItem('nydc_mun_selection');
      sessionStorage.removeItem('nydc_coupon');
      sessionStorage.removeItem('nydc_doc_id');

      // Success UI
      const card = document.querySelector('.registration-card');
      card.innerHTML = `
        <div style="text-align:center; padding:40px 0;">
          <div style="width:60px;height:60px;border-radius:50%;background:rgba(234,179,8,0.2);border:2px solid #eab308;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;margin-bottom:12px;">
            Registration <span style="color:#eab308;">Pending</span>
          </h2>
          <p style="font-family:'Outfit',sans-serif;color:#9ca3af;font-size:0.9rem;line-height:1.6;">
            Thank you, <strong style="color:#fff;">${registrationData.firstName}</strong>! Your registration is <strong style="color:#eab308;">pending approval</strong>.<br>
            Transaction ID: <strong style="color:#fff;">${transactionId}</strong><br>
            We'll verify your payment and send a confirmation email once approved.
          </p>
          <p style="font-family:'Outfit',sans-serif;color:#6b7280;font-size:0.75rem;margin-top:20px;">
            Redirecting to your profile…
          </p>
        </div>
      `;

      setTimeout(() => { window.location.href = 'profile.html'; }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Register Now';
      alert('Registration failed!\n\n' + error.message);
    }
  });
}
