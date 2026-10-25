const defaultOpportunities = [
  {
    id: 1,
    title: 'Tree Planting Weekend',
    organization: 'Green City Collective',
    description: 'Join a community effort to plant native trees and restore local parks in your neighborhood.',
    topic: 'Environment',
    date: 'Nov 02',
    time: '9:00 AM',
    url: '#',
    liked: true,
    saved: true,
  },
  {
    id: 2,
    title: 'Reading Mentor Program',
    organization: 'City Literacy Initiative',
    description: 'Support elementary students with reading sessions and book club activities after school.',
    topic: 'Education',
    date: 'Nov 05',
    time: '4:30 PM',
    url: '#',
    liked: false,
    saved: false,
  },
  {
    id: 3,
    title: 'Community Food Drive',
    organization: 'Neighbors Helping Neighbors',
    description: 'Help sort donated food, prepare care packs, and support families in need this weekend.',
    topic: 'Community',
    date: 'Nov 09',
    time: '10:00 AM',
    url: '#',
    liked: false,
    saved: true,
  },
  {
    id: 4,
    title: 'Animal Shelter Care Crew',
    organization: 'Paws & Promise',
    description: 'Assist with animal care, enrichment activities, and customer support at the local shelter.',
    topic: 'Animals',
    date: 'Nov 12',
    time: '1:00 PM',
    url: '#',
    liked: true,
    saved: false,
  },
  {
    id: 5,
    title: 'Health Fair Support',
    organization: 'Wellness for Youth',
    description: 'Help organize stations and welcome visitors at a wellness fair focused on health education.',
    topic: 'Health',
    date: 'Nov 16',
    time: '11:00 AM',
    url: '#',
    liked: false,
    saved: false,
  },
  {
    id: 6,
    title: 'STEM Lab Assistant',
    organization: 'Future Innovators Club',
    description: 'Guide younger students through coding games and simple engineering challenges in a lab setting.',
    topic: 'Education',
    date: 'Nov 20',
    time: '3:15 PM',
    url: '#',
    liked: false,
    saved: false,
  },
];

function getOpportunities() {
  const stored = localStorage.getItem('volunteerly-opportunities');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('volunteerly-opportunities', JSON.stringify(defaultOpportunities));
  return defaultOpportunities;
}

const opportunities = getOpportunities();

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
  localStorage.setItem("volunteerly-opportunities", JSON.stringify(opportunities));
  renderOpportunities();
}

function toggleSave(id) {
  const item = opportunities.find((opportunity) => opportunity.id === id);
  if (!item) return;
  item.saved = !item.saved;
  localStorage.setItem("volunteerly-opportunities", JSON.stringify(opportunities));
  renderOpportunities();
  renderSavedList();
  renderNotifications();
}

function syncOpportunities() {
  const stored = localStorage.getItem('volunteerly-opportunities');
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

renderAll();

/*
const newAlertButton = document.getElementById('newAlertButton');
const alertStatus = document.getElementById('alert status');
let alertPreferences = JSON.parse(
  localStorage.getItem('volunteerly-alerts') || '[]'
);

function updateAlertButton() {
  const enabled = alertPreferences.includes(activeFilter);

  newAlertButton.textContent = enabled
    ? `✓ Alert enabled: ${activeFilter}`
    : `+ New alert: ${activeFilter}`;

  newAlertButton.setAttribute('aria-pressed', String(enabled));
}

newAlertButton.addEventListener('click', () => {
  const index = alertPreferences.indexOf(activeFilter);

  if (index === -1) {
    alertPreferences.push(activeFilter);
    alertStatus.textContent =
      `Alerts enabled for ${activeFilter} opportunities.`;
  } else {
    alertPreferences.splice(index, 1);
    alertStatus.textContent =
      `Alerts disabled for ${activeFilter} opportunities.`;
  }

  localStorage.setItem(
    'volunteerly-alerts',
    JSON.stringify(alertPreferences)
  );

  updateAlertButton();
});

updateAlertButton();
*/
