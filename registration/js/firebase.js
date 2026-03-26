// Firebase configuration & Firestore registration handler
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, getDocs, query, where, deleteDoc } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDBo7RP1PSFhva-Ni0pKScX0MlIuUEAmnE",
  authDomain: "nydc-72b34.firebaseapp.com",
  projectId: "nydc-72b34",
  storageBucket: "nydc-72b34.firebasestorage.app",
  messagingSenderId: "935882112599",
  appId: "1:935882112599:web:f04b660e233f21a46f2d12",
  measurementId: "G-5G8Z44578K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ─── Initialize EmailJS ───
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: 'Vvw-ypTsbb2QHoiiX' });
}

// ─── Handle team-form submission (Page 3 — selection.html) ───
const form = document.getElementById('team-form');

// Only execute the submission logic if we are actually on the selection page
if (form) {
  const submitBtn = form.querySelector('.submit-btn');

  // Pull stored data from previous pages
  const storedPersonal = sessionStorage.getItem('nydc_registration');
  const storedEvent    = sessionStorage.getItem('nydc_event');
  const storedMun      = sessionStorage.getItem('nydc_mun_selection');

  if (!storedPersonal || !storedEvent) {
    window.location.href = '../registration.html';
  }

  const personalData = JSON.parse(storedPersonal);
  const eventData    = JSON.parse(storedEvent);
  const munPortfolios = storedMun ? JSON.parse(storedMun) : null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable button & show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    // Gather all team members from the cards
    const memberCards = document.querySelectorAll('.member-card');
    const teamMembers = [];

    memberCards.forEach((card, i) => {
      teamMembers.push({
        firstName: card.querySelector(`input[name="member_first_${card.dataset.index}"]`).value.trim(),
        lastName:  card.querySelector(`input[name="member_last_${card.dataset.index}"]`).value.trim(),
        email:     card.querySelector(`input[name="member_email_${card.dataset.index}"]`).value.trim(),
        phone:     card.querySelector(`input[name="member_phone_${card.dataset.index}"]`).value.trim(),
        school:    card.querySelector(`input[name="member_school_${card.dataset.index}"]`).value.trim(),
        role:      i === 0 ? 'leader' : 'member'
      });
    });

    // IPL Team Selection
    let iplTeam = null;
    if (eventData.event === 'ipl') {
      const selectedIpl = form.querySelector('input[name="ipl_team"]:checked');
      iplTeam = selectedIpl ? selectedIpl.value : null;
    }

    // Build full registration data
    const registrationData = {
      // Auth UID (set during registration)
      uid:          personalData.uid || null,
      // Leader / registrant info
      firstName:    personalData.firstName,
      lastName:     personalData.lastName,
      email:        personalData.email,
      phone:        personalData.phone,
      school:       personalData.school,
      grade:        personalData.grade,
      city:         personalData.city,
      // Event info
      event:        eventData.event,
      experience:   eventData.experience,
      munPortfolios: munPortfolios,
      iplTeam:      iplTeam,
      // Team info
      teamSize:     teamMembers.length,
      teamMembers:  teamMembers,
      // Metadata
      registeredAt: serverTimestamp(),
      status: 'pending' // Move from draft to pending
    };

    try {
      let FinalDocId = null;
      const storedDocId = sessionStorage.getItem('nydc_doc_id');

      if (storedDocId) {
        const draftRef = doc(db, 'registrations', storedDocId);
        await updateDoc(draftRef, registrationData);
        FinalDocId = storedDocId;
        console.log('Draft updated. ID:', FinalDocId);
      } else {
        const docRef = await addDoc(collection(db, 'registrations'), registrationData);
        FinalDocId = docRef.id;
        console.log('Registration saved. ID:', FinalDocId);
      }

      // ─── Send confirmation email via EmailJS ───
      if (typeof emailjs !== 'undefined') {
        const EVENT_NAMES = {
          mun: 'Model United Nations', moot_court: 'Moot Court',
          hackathon: 'Hackathon', debate: 'Conventional Debate',
          spark_tank: 'Spark Tank', marketing: 'Marketing',
          paper_trading: 'Paper Trading', film_making: 'Film Making',
          Navras: 'Navras', poetry: 'Poetry',
          raag_jaam: 'Raag Jaam', ipl: 'IPL'
        };

        const teamList = teamMembers.map((m, i) =>
          `${i + 1}. ${m.firstName} ${m.lastName} (${m.email})`
        ).join('\n');

        const emailParams = {
          to_name:          registrationData.firstName + ' ' + registrationData.lastName,
          to_email:         registrationData.email,
          event_name:       EVENT_NAMES[registrationData.event] || registrationData.event,
          team_size:        registrationData.teamSize,
          team_members:     teamList,
          registration_id:  FinalDocId,
          school:           registrationData.school,
          city:             registrationData.city
        };

        try {
          await emailjs.send('service_1fxd5y7', 'template_09rbyci', emailParams);
          console.log('Confirmation email sent successfully');
        } catch (emailErr) {
          console.warn('EmailJS failed (registration still saved):', emailErr);
        }
      }

      // ─── Cleanup: delete any other draft docs for this UID ───
      // Prevents duplicates showing up in profile when user changed event mid-way
      try {
        const uid = registrationData.uid;
        if (uid) {
          const draftsQ = query(collection(db, 'registrations'), where('uid', '==', uid), where('status', '==', 'draft'));
          const draftsSnap = await getDocs(draftsQ);
          for (const draftDoc of draftsSnap.docs) {
            // Don't delete the doc we just saved/updated
            if (draftDoc.id !== FinalDocId) {
              await deleteDoc(doc(db, 'registrations', draftDoc.id));
              console.log('Deleted orphan draft:', draftDoc.id);
            }
          }
        }
      } catch (cleanupErr) {
        console.warn('Draft cleanup failed (non-critical):', cleanupErr);
      }

      // Clear all sessionStorage
      sessionStorage.removeItem('nydc_registration');
      sessionStorage.removeItem('nydc_event');
      sessionStorage.removeItem('nydc_mun_selection');
      sessionStorage.removeItem('nydc_doc_id');

      // Show success
      const card = document.querySelector('.registration-card');
      card.innerHTML = `
        <div style="text-align:center; padding:40px 0;">
          <div style="width:60px;height:60px;border-radius:50%;background:rgba(139,26,26,0.2);border:2px solid #8b1a1a;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b1a1a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;margin-bottom:12px;">
            Registration <span style="color:#8b1a1a;">Confirmed</span>
          </h2>
          <p style="font-family:'Outfit',sans-serif;color:#9ca3af;font-size:0.9rem;line-height:1.6;">
            Thank you, <strong style="color:#fff;">${registrationData.firstName}</strong>! Your team of <strong style="color:#fff;">${registrationData.teamSize}</strong> has been registered.<br>
            A confirmation email has been sent to <strong style="color:#fff;">${registrationData.email}</strong>.
          </p>
          <p style="font-family:'Outfit',sans-serif;color:#6b7280;font-size:0.75rem;margin-top:16px;letter-spacing:0.1em;text-transform:uppercase;">
            Registration ID: ${FinalDocId}
          </p>
        </div>
      `;
    } catch (error) {
      console.error('Error saving registration:', error);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Register Now';
      alert('Something went wrong. Please try again.\n\nError: ' + error.message);
    }
  });
}
