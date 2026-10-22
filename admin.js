const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'volunteerly123';

const adminLoginSection = document.getElementById('adminLoginSection');
const adminDashboard = document.getElementById('adminDashboard');
const adminLoginForm = document.getElementById('adminLoginForm');
const loginMessage = document.getElementById('loginMessage');
const opportunityForm = document.getElementById('opportunityForm');
const submitMessage = document.getElementById('submitMessage');
const adminOpportunityList = document.getElementById('adminOpportunityList');

function getStoredOpportunities() {
  const saved = localStorage.getItem('volunteerly-opportunities');
  return saved ? JSON.parse(saved) : [];
}

function setStoredOpportunities(opportunities) {
  localStorage.setItem('volunteerly-opportunities', JSON.stringify(opportunities));
}

function getAllOpportunities() {
  const starter = [
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
  ];

  const stored = getStoredOpportunities();
  return stored.length ? stored : starter;
}

function renderAdminOpportunityList() {
  const opportunities = getAllOpportunities();

  adminOpportunityList.innerHTML = opportunities
    .map(
      (item) => `
        <div class="admin-opportunity-item">
          <div>
            <strong>${item.title}</strong>
            <p>${item.organization} • ${item.topic}</p>
          </div>
          <button class="danger-btn" data-delete-id="${item.id}">Delete</button>
        </div>
      `
    )
    .join('');
}

adminLoginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    adminLoginSection.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    loginMessage.textContent = '';
    renderAdminOpportunityList();
  } else {
    loginMessage.textContent = 'Invalid admin credentials. Please try again.';
  }
});

opportunityForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const organization = document.getElementById('organization').value.trim();
  const description = document.getElementById('description').value.trim();
  const topic = document.getElementById('topic').value;
  const date = document.getElementById('date').value.trim();
  const time = document.getElementById('time').value.trim();
  const url = document.getElementById('url').value.trim();

  if (!title || !organization || !description || !date || !time || !url) {
    submitMessage.textContent = 'Please complete all required fields.';
    return;
  }

  const opportunities = getAllOpportunities();
  const nextId = opportunities.length ? Math.max(...opportunities.map((item) => item.id)) + 1 : 1;

  const newOpportunity = {
    id: nextId,
    title,
    organization,
    description,
    topic,
    date,
    time,
    url,
    liked: false,
    saved: false,
  };

  const updated = [newOpportunity, ...opportunities];
  setStoredOpportunities(updated);
  renderAdminOpportunityList();
  opportunityForm.reset();
  submitMessage.textContent = 'Opportunity added successfully.';

  const appOpportunityData = JSON.parse(localStorage.getItem('volunteerly-opportunities') || '[]');
  if (window.opportunityStore) {
    window.opportunityStore = appOpportunityData;
  }
});

adminOpportunityList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-id]');
  if (!deleteButton) return;

  const id = Number(deleteButton.dataset.deleteId);
  const opportunities = getAllOpportunities().filter((item) => item.id !== id);
  setStoredOpportunities(opportunities);
  renderAdminOpportunityList();
  submitMessage.textContent = 'Opportunity deleted.';
});

renderAdminOpportunityList();
