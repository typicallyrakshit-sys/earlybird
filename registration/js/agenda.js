// ─── Firebase Imports ───
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';

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
const db = getFirestore(app);

// ─── Committee Portfolio Data (mirrored from mun.js for the 4 committees) ───
const COMMITTEES = {
  unga: {
    name: 'UNGA',
    portfolios: [
      'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
      'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
      'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
      'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica',
      'Côte d\u2019Ivoire','Croatia','Cuba','Cyprus','Czechia','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic',
      'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland',
      'France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea',
      'Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq',
      'Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait',
      'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg',
      'Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico',
      'Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru',
      'Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman',
      'Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar',
      'Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino',
      'Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
      'Solomon Islands','Somalia','South Africa','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland',
      'Syria','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey',
      'Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
      'Vanuatu','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
    ]
  },
  uncsw: {
    name: 'UNCSW',
    portfolios: [
      'Angola','Burkina Faso','Cameroon','Chad','Comoros','Congo','Côte d\u2019Ivoire','Equatorial Guinea','Kenya','Liberia',
      'Madagascar','Niger','United Republic of Tanzania','Bangladesh','China','India','Indonesia','Iran','Japan','Lebanon',
      'Mongolia','Pakistan','Philippines','Saudi Arabia','Argentina','Bolivia','Brazil','Colombia','Cuba','Dominican Republic',
      'El Salvador','Mexico','Paraguay','Austria','Belgium','Canada','France','Germany','Italy','Sweden',
      'United States','Armenia','Poland','Romania','Russian Federation'
    ]
  },
  unhrc: {
    name: 'UNHRC',
    portfolios: [
      'Albania', 'Angola', 'Benin', 'Bolivia (Plurinational State of)', 'Brazil', 'Bulgaria', 'Burundi', 'Chile', 'China', 'Colombia', 
      'Côte d’Ivoire', 'Cuba', 'Cyprus', 'Czechia', 'Democratic Republic of the Congo', 'Dominican Republic', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 
      'France', 'Gambia', 'Ghana', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Italy', 'Japan', 'Kenya', 
      'Kuwait', 'Malawi', 'Marshall Islands', 'Mauritius', 'Mexico', 'Netherlands (Kingdom of the)', 'North Macedonia', 'Pakistan', 'Qatar', 'Republic of Korea', 
      'Slovenia', 'South Africa', 'Spain', 'Switzerland', 'Thailand', 'United Kingdom of Great Britain and Northern Ireland', 'Viet Nam'
    ]
  },
  who: {
    name: 'WHO',
    portfolios: [
      'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
      'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
      'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
      'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica',
      'Côte d\u2019Ivoire','Croatia','Cuba','Cyprus','Czechia','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic',
      'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland',
      'France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea',
      'Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq',
      'Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait',
      'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg',
      'Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico',
      'Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru',
      'Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman',
      'Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar',
      'Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino',
      'Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
      'Solomon Islands','Somalia','South Africa','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland',
      'Syria','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey',
      'Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
      'Vanuatu','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
    ]
  },
  aippm: {
    name: 'AIPPM',
    portfolios: [
      'Narendra Modi','Rajnath Singh','Amit Shah','Nirmala Sitharaman','S. Jaishankar',
      'Nitin Gadkari','Piyush Goyal','Ashwini Vaishnaw','Dharmendra Pradhan','Hardeep Singh Puri',
      'Jyotiraditya Scindia','Sarbananda Sonowal','Gajendra Singh Shekhawat','Bhupender Yadav',
      'Mansukh Mandaviya','Kiren Rijiju','J. P. Nadda','Rahul Gandhi','Mallikarjun Kharge',
      'Shashi Tharoor','Adhir Ranjan Chowdhury','Arvind Kejriwal','Atishi','Mamata Banerjee',
      'Akhilesh Yadav','Tejashwi Yadav','Nitish Kumar','Uddhav Thackeray','Eknath Shinde',
      'Devendra Fadnavis','Yogi Adityanath','K. Chandrashekar Rao','M. K. Stalin',
      'Pinarayi Vijayan','Chirag Paswan','Asaduddin Owaisi','Sukhbir Singh Badal','Hemant Soren'
    ]
  }
};

// ─── Fetch taken portfolios from Firebase ───
async function fetchTakenPortfolios() {
  const takenMap = { unga: new Set(), uncsw: new Set(), unhrc: new Set(), who: new Set(), aippm: new Set() };

  try {
    const regsRef = collection(db, 'registrations');
    const q = query(regsRef, where('event', '==', 'mun'));
    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.munPortfolios && Array.isArray(data.munPortfolios)) {
        data.munPortfolios.forEach(p => {
          const comId = (p.committeeId || '').toLowerCase();
          if (takenMap[comId]) {
            takenMap[comId].add(p.portfolioName);
          }
        });
      }
    });
  } catch (err) {
    console.error('Error fetching registrations:', err);
  }

  return takenMap;
}

// ─── Render portfolio grid for a committee ───
function renderGrid(committeeId, takenSet, searchQuery = '') {
  const grid = document.getElementById(`grid-${committeeId}`);
  const committee = COMMITTEES[committeeId];
  if (!grid || !committee) return;

  const query = searchQuery.trim().toLowerCase();
  let portfolios = committee.portfolios;

  if (query) {
    portfolios = portfolios.filter(name => name.toLowerCase().includes(query));
  }

  // Sort: available first, then taken
  const sorted = [...portfolios].sort((a, b) => {
    const aTaken = takenSet.has(a) ? 1 : 0;
    const bTaken = takenSet.has(b) ? 1 : 0;
    if (aTaken !== bTaken) return aTaken - bTaken;
    return a.localeCompare(b);
  });

  if (sorted.length === 0) {
    grid.innerHTML = `<div class="no-results-msg">No portfolios match "${searchQuery}"</div>`;
    return;
  }

  grid.innerHTML = sorted.map(name => {
    const isTaken = takenSet.has(name);
    return `
      <div class="portfolio-card ${isTaken ? 'taken' : ''}">
        <span class="portfolio-name" title="${name}">${name}</span>
        <span class="status-badge ${isTaken ? 'taken' : 'available'}">${isTaken ? 'Taken' : 'Available'}</span>
      </div>
    `;
  }).join('');

  // Update stats
  const totalTaken = committee.portfolios.filter(n => takenSet.has(n)).length;
  const totalAvailable = committee.portfolios.length - totalTaken;
  const availableEl = document.getElementById(`${committeeId}-available`);
  const takenEl = document.getElementById(`${committeeId}-taken`);
  if (availableEl) availableEl.textContent = totalAvailable;
  if (takenEl) takenEl.textContent = totalTaken;
}

// ─── Tab Switching ───
function initTabs(takenMap) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const comId = btn.dataset.committee;

      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active panel
      panels.forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(`panel-${comId}`);
      if (targetPanel) {
        targetPanel.classList.remove('active');
        // Force reflow for animation
        void targetPanel.offsetWidth;
        targetPanel.classList.add('active');
      }
    });
  });
}

// ─── Search within each committee ───
function initSearch(takenMap) {
  const searchInputs = document.querySelectorAll('.portfolio-search');
  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      const comId = input.dataset.committee;
      renderGrid(comId, takenMap[comId], input.value);
    });
  });
}

// ─── Initialize ───
async function init() {
  const takenMap = await fetchTakenPortfolios();

  // Render all grids
  Object.keys(COMMITTEES).forEach(comId => {
    renderGrid(comId, takenMap[comId]);
  });

  initTabs(takenMap);
  initSearch(takenMap);
}

init();
