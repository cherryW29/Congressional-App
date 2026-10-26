const STORAGE_KEY = 'volunteerly-opportunities';
const USER_STORAGE_KEY = 'volunteerly-users';
const CURRENT_USER_KEY = 'volunteerly-current-user';

const authModal = document.getElementById('authModal');
const authButton = document.getElementById('authButton');
const profileName = document.getElementById('profileName');
const profileAvatar = document.getElementById('profileAvatar');
const authTitle = document.getElementById('authTitle');
const closeAuthModal = document.getElementById('closeAuthModal');
const authForm = document.getElementById('authForm');
const authMessage = document.getElementById('authMessage');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const emailField = document.getElementById('emailField');
const authUsername = document.getElementById('authUsername');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authTabs = document.querySelectorAll('.auth-tab');
const logoutButton = document.getElementById('logoutButton');
const guestState = document.getElementById('guestState');
const dashboardContent = document.getElementById('dashboardContent');
const guestRegisterButton = document.getElementById('guestRegisterButton');
let authMode = 'login';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
    profileName.textContent = 'Guest';
    profileAvatar.textContent = 'G';
    return;
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  profileName.textContent = user.username || 'Guest';
  profileAvatar.textContent = (user.username || 'G').charAt(0).toUpperCase();
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
  } catch {
    return null;
  }
}

function openAuthModal(mode = 'login') {
  authMode = mode;
  authTitle.textContent = mode === 'register' ? 'Register' : 'Login';
  authSubmitBtn.textContent = mode === 'register' ? 'Create account' : 'Login';
  emailField.classList.toggle('hidden', mode !== 'register');
  authMessage.textContent = '';
  authModal.classList.remove('hidden');
  authModal.setAttribute('aria-hidden', 'false');
  authTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.mode === mode));
}

function closeAuthModalFn() {
  authModal.classList.add('hidden');
  authModal.setAttribute('aria-hidden', 'true');
  authForm.reset();
  authMessage.textContent = '';
}

authButton.addEventListener('click', () => openAuthModal('login'));
closeAuthModal.addEventListener('click', closeAuthModalFn);
authModal.addEventListener('click', (event) => {
  if (event.target === authModal) closeAuthModalFn();
});

authTabs.forEach((tab) => {
  tab.addEventListener('click', () => openAuthModal(tab.dataset.mode));
});

authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = authUsername.value.trim();
  const password = authPassword.value.trim();

  if (!username || !password) {
    authMessage.textContent = 'Please enter a username and password.';
    return;
  }

  const users = readUsers();

  if (authMode === 'register') {
    const email = authEmail.value.trim();
    if (!email) {
      authMessage.textContent = 'Please enter your email to register.';
      return;
    }

    if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      authMessage.textContent = 'That username is already in use.';
      return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    writeUsers(users);
    setCurrentUser(newUser);
    authMessage.textContent = 'Account created successfully.';
    closeAuthModalFn();
    updateAuthUI();
    return;
  }

  const user = users.find(
    (entry) => entry.username.toLowerCase() === username.toLowerCase() && entry.password === password
  );

  if (!user) {
    authMessage.textContent = 'Invalid username or password.';
    return;
  }

  setCurrentUser(user);
  closeAuthModalFn();
  updateAuthUI();
});

const storedUser = getCurrentUser();
if (storedUser) {
  setCurrentUser(storedUser);
} else {
  setCurrentUser(null);
}
updateAuthUI();

const defaultOpportunities = [
  {
    id: 1,
    title: 'Sample Opportunity',
    organization: 'Volunteerly',
    description: 'Fallback data while the JSON file is loading.',
    topic: 'Community Service',
    date: 'Flexible',
    time: 'Flexible',
    age: 'High school students',
    url: '#',
    liked: false,
    saved: false,
  },
];

function normalizeCategory(category) {
  const normalized = String(category || '').trim();
  const aliases = {
    Environment: 'Environment',
    Education: 'Education',
    Community: 'Community Service',
    CommunityService: 'Community Service',
    'Community Service': 'Community Service',
    Animals: 'Animal Care',
    AnimalCare: 'Animal Care',
    'Animal Care': 'Animal Care',
    Health: 'Health',
    Healthcare: 'Health',
    Technology: 'Technology',
    Business: 'Business',
    SeniorSupport: 'Community Service',
    FoodInsecurity: 'Community Service',
    Leadership: 'Business',
    Sports: 'Health',
    Arts: 'Business',
  };

  return aliases[normalized] || normalized || 'Community Service';
}

function normalizeOpportunity(raw = {}) {
  return {
    id: Number(raw.id ?? Date.now()),
    title: raw.title || 'Untitled opportunity',
    organization: raw.organization || 'Unknown organization',
    description: raw.description || raw.notes || 'No description available.',
    topic: normalizeCategory(raw.category || raw.topic),
    date: raw.date || 'Flexible',
    time: raw.time || raw.schedule || 'Flexible',
    age: raw.age || 'High school students',
    url: raw.url || '#',
    liked: Boolean(raw.liked),
    saved: Boolean(raw.saved),
  };
}

async function getOpportunities() {
  const stored = localStorage.getItem(STORAGE_KEY);

  try {
    const response = await fetch('/opportunities.json');
    if (!response.ok) {
      throw new Error('Failed to load opportunities.json');
    }

    const payload = await response.json();
    const remoteOpportunities = Array.isArray(payload) ? payload.map(normalizeOpportunity) : [];

    if (remoteOpportunities.length) {
      const localData = stored ? JSON.parse(stored) : [];
      const activeData = Array.isArray(localData) && localData.length ? localData : remoteOpportunities;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeData));
      return activeData;
    }

    throw new Error('No opportunities returned from JSON file');
  } catch (error) {
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      } catch (_ignored) {
        // Ignore storage parse failures and fall back below.
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOpportunities));
    return defaultOpportunities;
  }
}

let opportunities = [];

async function initializeOpportunities() {
  opportunities = await getOpportunities();
  renderAll();
}

const opportunityList = document.getElementById('opportunityList');
const savedList = document.getElementById('savedList');
const savedCount = document.getElementById('savedCount');
const notificationList = document.getElementById('notificationList');
const searchInput = document.getElementById('searchInput');
const topicButtons = document.querySelectorAll('.topic-chip');

let activeFilter = 'All';

function getFilteredOpportunities() {
  const query = searchInput.value.trim().toLowerCase();

  return opportunities.filter((opportunity) => {
    const matchesFilter = activeFilter === 'All' || opportunity.topic === activeFilter;
    const matchesSearch = !query || `${opportunity.title} ${opportunity.organization} ${opportunity.description}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
}

function renderOpportunities() {
  const filtered = getFilteredOpportunities();

  if (!filtered.length) {
    opportunityList.innerHTML = '<div class="empty-state">No opportunities match your search.</div>';
    return;
  }

  opportunityList.innerHTML = filtered
    .map(
      (item) => `
        <article class="opportunity-card">
          <div>
            <div class="card-top">
              <span class="topic-badge">${item.topic}</span>
              <button class="like-btn ${item.liked ? 'active' : ''}" data-action="like" data-id="${item.id}">♥</button>
            </div>

            <h3>${item.title}</h3>
            <div class="org">${item.organization}</div>
            <p class="card-description">${item.description}</p>
            <span class="age-tag">${item.age}</span>
          </div>

          <div>
            <div class="meta-row">
              <span>${item.date}</span>
              <span>${item.time}</span>
            </div>

            <div class="card-actions">
              <a class="link-btn" href="${item.url}" target="_blank" rel="noreferrer">Learn more</a>
              <button class="save-btn ${item.saved ? 'saved' : ''}" data-action="save" data-id="${item.id}">
                ${item.saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function renderSavedList() {
  const saved = opportunities.filter((item) => item.saved);
  savedCount.textContent = saved.length;

  if (!saved.length) {
    savedList.innerHTML = '<div class="empty-state">No saved opportunities yet.</div>';
    return;
  }

  savedList.innerHTML = saved
    .map(
      (item) => `
        <div class="saved-item">
          <div>
            <strong>${item.title}</strong>
            <br />
            <span>${item.date}</span>
          </div>
          <span>✓</span>
        </div>
      `
    )
    .join('');
}

function renderNotifications() {
  const upcoming = opportunities.filter((item) => item.saved).slice(0, 3);

  if (!upcoming.length) {
    notificationList.innerHTML = '<li class="notification-item">Save an opportunity to get reminders here.</li>';
    return;
  }

  notificationList.innerHTML = upcoming
    .map(
      (item) => `
        <li class="notification-item">
          Reminder: ${item.title} is on ${item.date} at ${item.time}.
        </li>
      `
    )
    .join('');
}

function toggleLike(id) {
  const item = opportunities.find((opportunity) => opportunity.id === id);
  if (!item) return;
  item.liked = !item.liked;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
  renderOpportunities();
}

function toggleSave(id) {
  const item = opportunities.find((opportunity) => opportunity.id === id);
  if (!item) return;
  item.saved = !item.saved;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
  renderOpportunities();
  renderSavedList();
  renderNotifications();
}

function syncOpportunities() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    opportunities.length = 0;
    opportunities.push(...JSON.parse(stored));
  }
}

function renderAll() {
  renderOpportunities();
  renderSavedList();
  renderNotifications();
}

window.addEventListener('storage', () => {
  syncOpportunities();
  renderAll();
});

opportunityList.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;

  const id = Number(target.dataset.id);
  const action = target.dataset.action;

  if (action === 'like') toggleLike(id);
  if (action === 'save') toggleSave(id);
});

topicButtons.forEach((button) => {
  button.addEventListener('click', () => {
    topicButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    renderOpportunities();
  });
});

searchInput.addEventListener('input', () => {
  renderOpportunities();
});

initializeOpportunities();

const newAlertButton = document.getElementById('newAlertButton');
const alertStatus = document.getElementById('alertStatus');
let alertPreferences = JSON.parse(localStorage.getItem('volunteerly-alerts') || '[]');

function updateAlertButton() {
  const enabled = alertPreferences.includes(activeFilter);

  newAlertButton.textContent = enabled ? `✓ Alert enabled: ${activeFilter}` : `+ New alert`;
  newAlertButton.setAttribute('aria-pressed', String(enabled));
}

newAlertButton.addEventListener('click', () => {
  const index = alertPreferences.indexOf(activeFilter);

  if (index === -1) {
    alertPreferences.push(activeFilter);
    alertStatus.textContent = `Alerts enabled for ${activeFilter} opportunities.`;
  } else {
    alertPreferences.splice(index, 1);
    alertStatus.textContent = `Alerts disabled for ${activeFilter} opportunities.`;
  }

  localStorage.setItem('volunteerly-alerts', JSON.stringify(alertPreferences));
  updateAlertButton();
});

updateAlertButton();

const reloadButton = document.getElementById('reloadButton');

async function reloadOpportunitiesFromFile() {
  try {
    reloadButton.disabled = true;
    reloadButton.textContent = 'Reloading...';

    const response = await fetch('/reload-opportunities-json', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Reload failed');
    }

    const data = await getOpportunities();
    opportunities.length = 0;
    opportunities.push(...data);
    renderAll();
  } catch (error) {
    alert('Unable to reload opportunities.json right now.');
  } finally {
    reloadButton.disabled = false;
    reloadButton.textContent = 'Reload opportunities';
  }
}

reloadButton.addEventListener('click', reloadOpportunitiesFromFile);

function updateAuthUI() {
  const user = getCurrentUser();
  const isLoggedIn = Boolean(user);

  authButton.classList.toggle('hidden', isLoggedIn);
  logoutButton.classList.toggle('hidden', !isLoggedIn);

  if (isLoggedIn) {
    setCurrentUser(user);
    guestState.classList.add('hidden');
    dashboardContent.classList.remove('hidden');
  } else {
    profileName.textContent = 'Guest';
    profileAvatar.textContent = 'G';
    guestState.classList.remove('hidden');
    dashboardContent.classList.add('hidden');
  }
}

function logoutUser() {
  setCurrentUser(null);
  updateAuthUI();
}

function openRegisterFlow() {
  openAuthModal('register');
}

logoutButton.addEventListener('click', logoutUser);
guestRegisterButton.addEventListener('click', openRegisterFlow);
