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
  
[
  {
    "id": 1,
    "title": "High School Volunteer Program",
    "organization": "Pleasanton Public Library",
    "city": "Pleasanton",
    "category": "Education",
    "age": "High school students",
    "status": "eligible",
    "url": "https://app.betterimpact.com/PublicOrganization/651c22f0-c727-4270-97a9-17b17e328f02/1"
  },
  {
    "id": 2,
    "title": "Friends of the Library Volunteering",
    "organization": "Friends of the Pleasanton Library",
    "city": "Pleasanton",
    "category": "Education",
    "age": "Teens and adults",
    "status": "eligible",
    "url": "https://www.cityofpleasantonca.gov/your-community/pleasanton-library/get-involved/"
  },
  {
    "id": 3,
    "title": "Gardening and Community Service",
    "organization": "Alviso Adobe Community Park",
    "city": "Pleasanton",
    "category": "Environment",
    "age": "Grade 9+",
    "status": "eligible",
    "url": "https://www.cityofpleasantonca.gov/your-community/recreation/alviso-adobe/"
  },
  {
    "id": 4,
    "title": "Historical Docent and Tours",
    "organization": "Alviso Adobe Community Park",
    "city": "Pleasanton",
    "category": "Education",
    "age": "16+",
    "status": "eligible",
    "url": "https://www.cityofpleasantonca.gov/your-community/recreation/alviso-adobe/"
  },
  {
    "id": 5,
    "title": "Student Virtual Tutoring",
    "organization": "Pleasanton PTA Community Volunteer Hub",
    "city": "Pleasanton / Virtual",
    "category": "Education",
    "age": "High school students",
    "status": "check",
    "url": "https://www.pleasantonpta.org/programs/community-volunteer-hub"
  },
  {
    "id": 6,
    "title": "Family and Donation Support",
    "organization": "Hively",
    "city": "Pleasanton",
    "category": "Community Service",
    "age": "Check with organization",
    "status": "check",
    "url": "https://www.mad4p.org/hively/"
  },
  {
    "id": 7,
    "title": "Summer Teen Volunteer Program",
    "organization": "Tri-Valley Haven",
    "city": "Livermore",
    "category": "Community Service",
    "age": "15+",
    "status": "seasonal",
    "url": "https://trivalleyhaven.org/volunteer/"
  },
  {
    "id": 8,
    "title": "Food Pantry Volunteering",
    "organization": "Tri-Valley Haven",
    "city": "Livermore",
    "category": "Food Insecurity",
    "age": "16+",
    "status": "eligible",
    "url": "https://trivalleyhaven.org/volunteer/"
  },
  {
    "id": 9,
    "title": "Thrift Store Volunteering",
    "organization": "Tri-Valley Haven",
    "city": "Livermore",
    "category": "Community Service",
    "age": "16+",
    "status": "eligible",
    "url": "https://trivalleyhaven.org/volunteer/"
  },
  {
    "id": 10,
    "title": "Holiday and Special Event Support",
    "organization": "Tri-Valley Haven",
    "city": "Livermore",
    "category": "Community Service",
    "age": "Check event requirements",
    "status": "check",
    "url": "https://trivalleyhaven.org/volunteer/"
  },
  {
    "id": 11,
    "title": "Animal Care Center Volunteer",
    "organization": "Valley Humane Society",
    "city": "Pleasanton",
    "category": "Animals",
    "age": "16+; confirm current policy",
    "status": "check",
    "url": "https://valleyhumane.org/volunteer/"
  },
  {
    "id": 12,
    "title": "Youth Animal Support Projects",
    "organization": "Valley Humane Society",
    "city": "Pleasanton",
    "category": "Animals",
    "age": "Ask about youth projects",
    "status": "check",
    "url": "https://valleyhumane.org/volunteer/"
  },
  {
    "id": 13,
    "title": "Hospital Volunteering",
    "organization": "Stanford Health Care Tri-Valley",
    "city": "Pleasanton",
    "category": "Healthcare",
    "age": "16+; confirm current requirements",
    "status": "check",
    "url": "https://stanfordhealthcare.org/tri-valley/patients-and-visitors/volunteers.html"
  },
  {
    "id": 14,
    "title": "Neighborhood Park Ambassador",
    "organization": "Livermore Area Recreation and Park District",
    "city": "Livermore",
    "category": "Environment",
    "age": "13+",
    "status": "eligible",
    "url": "https://www.larpd.org/volunteer-neighborhood-park-ambassador"
  },
  {
    "id": 15,
    "title": "Police Explorer Program",
    "organization": "Pleasanton Police Department",
    "city": "Pleasanton",
    "category": "Leadership",
    "age": "14–20; check enrollment",
    "status": "check",
    "url": "https://www.cityofpleasantonca.gov/our-government/police/programs-outreach/"
  },
  {
    "id": 16,
    "title": "Leader in Training Summer Program",
    "organization": "City of Pleasanton Recreation",
    "city": "Pleasanton",
    "category": "Leadership",
    "age": "Entering grades 9–10",
    "status": "seasonal",
    "url": "https://www.cityofpleasantonca.gov/your-community/recreation/recreation-youth-and-teen-programs/"
  },
  {
    "id": 17,
    "title": "Meal Packing Events",
    "organization": "Kids Against Hunger Bay Area",
    "city": "Pleasanton",
    "category": "Food Insecurity",
    "age": "Youth participation; check event rules",
    "status": "eligible",
    "url": "https://register.kahbayarea.org/"
  },
  {
    "id": 18,
    "title": "Park Trail Maintenance",
    "organization": "East Bay Regional Park District",
    "city": "East Bay / Livermore",
    "category": "Environment",
    "age": "10+; under 18 with adult",
    "status": "eligible",
    "url": "https://www.ebparks.org/volunteer/volunteer-trail-opportunities"
  },
  {
    "id": 19,
    "title": "Downtown Event Volunteering",
    "organization": "Pleasanton Downtown Association",
    "city": "Pleasanton",
    "category": "Community Service",
    "age": "Check event requirements",
    "status": "check",
    "url": "https://www.pleasantondowntown.net/committees-volunteers"
  },
  {
    "id": 20,
    "title": "Concerts in the Park Cleanup",
    "organization": "Pleasanton Downtown Association",
    "city": "Pleasanton",
    "category": "Environment",
    "age": "Check upcoming season",
    "status": "seasonal",
    "url": "https://www.pleasantondowntown.net/concert-in-the-park"
  },
  {
    "id": 21,
    "title": "Community Service Events",
    "organization": "Pleasanton Lions Club",
    "city": "Pleasanton",
    "category": "Community Service",
    "age": "Check event requirements",
    "status": "check",
    "url": "https://pleasantonlionsclub.org/useful-articles/volunteer-opportunities-near-me/"
  },
  {
    "id": 22,
    "title": "Youth Commission",
    "organization": "City of Pleasanton",
    "city": "Pleasanton",
    "category": "Leadership",
    "age": "Check appointment eligibility",
    "status": "check",
    "url": "https://www.cityofpleasantonca.gov/your-community/youth-teens/"
  },
  {
    "id": 23,
    "title": "Museum and History Events",
    "organization": "Museum on Main",
    "city": "Pleasanton",
    "category": "Education",
    "age": "Check with museum",
    "status": "check",
    "url": "https://www.cityofpleasantonca.gov/our-government/boards-commissions/volunteer-in-pleasanton/"
  },
  {
    "id": 24,
    "title": "Community Meals and Assistance",
    "organization": "CityServe of the Tri-Valley",
    "city": "Tri-Valley",
    "category": "Food Insecurity",
    "age": "Check assignment",
    "status": "check",
    "url": "https://cityservecares.org/serve/"
  },
  {
    "id": 25,
    "title": "Faith-Based Community Service",
    "organization": "Catholic Community of Pleasanton",
    "city": "Pleasanton",
    "category": "Community Service",
    "age": "Check program",
    "status": "check",
    "url": "https://www.catholicsofpleasanton.org/service-opportunities.html"
  },
  {
    "id": 26,
    "title": "Parks and Community Services",
    "organization": "City of Dublin",
    "city": "Dublin",
    "category": "Community Service",
    "age": "Age varies",
    "status": "check",
    "url": "https://dublin.ca.gov/1402/Volunteer-Opportunities"
  },
  {
    "id": 27,
    "title": "Junior Basketball League Assistance",
    "organization": "City of Dublin",
    "city": "Dublin",
    "category": "Sports",
    "age": "Check assignment",
    "status": "check",
    "url": "https://dublin.ca.gov/1402/Volunteer-Opportunities"
  },
  {
    "id": 28,
    "title": "Heritage Park and Museums Volunteer",
    "organization": "City of Dublin",
    "city": "Dublin",
    "category": "Education",
    "age": "Check age",
    "status": "check",
    "url": "https://dublin.ca.gov/453/Jobs-Volunteer-Opportunities"
  },
  {
    "id": 29,
    "title": "Performing Arts Event Support",
    "organization": "City of Dublin",
    "city": "Dublin",
    "category": "Arts",
    "age": "14+; verify role",
    "status": "check",
    "url": "https://dublin.ca.gov/1887/Performing-Arts-Events"
  },
  {
    "id": 30,
    "title": "Senior Center Volunteer",
    "organization": "City of Dublin",
    "city": "Dublin",
    "category": "Senior Support",
    "age": "Check age",
    "status": "check",
    "url": "https://dublin.ca.gov/453/Jobs-Volunteer-Opportunities"
  },
  {
    "id": 31,
    "title": "Community Recreation and Parks",
    "organization": "Livermore Area Recreation and Park District",
    "city": "Livermore",
    "category": "Sports",
    "age": "13+ for many roles; verify",
    "status": "check",
    "url": "https://www.larpd.org/volunteer"
  },
  {
    "id": 32,
    "title": "Habitat Restoration and Cleanup",
    "organization": "East Bay Regional Park District",
    "city": "East Bay",
    "category": "Environment",
    "age": "Varies by project",
    "status": "check",
    "url": "https://www.ebparks.org/volunteer"
  },
  {
    "id": 33,
    "title": "Animal Rescue Support",
    "organization": "Tri-Valley Animal Rescue",
    "city": "Tri-Valley",
    "category": "Animals",
    "age": "Ask about teen support roles",
    "status": "check",
    "url": "https://www.tvar.org/volunteer"
  },
  {
    "id": 34,
    "title": "Senior and Community Services",
    "organization": "Spectrum Community Services",
    "city": "Tri-Valley",
    "category": "Senior Support",
    "age": "Check age",
    "status": "check",
    "url": "https://www.spectrumcs.org/volunteers"
  },
  {
    "id": 35,
    "title": "Teen Service Opportunities",
    "organization": "Tri-Valley Volunteer / Lions Heart",
    "city": "Tri-Valley",
    "category": "Community Service",
    "age": "Teens 13–18",
    "status": "check",
    "url": "https://www.trivalleyvolunteer.org/ages-13-18"
  },
  {
    "id": 36,
    "title": "Hunger Relief Volunteer",
    "organization": "Open Heart Kitchen",
    "city": "Tri-Valley",
    "category": "Food Insecurity",
    "age": "Check role",
    "status": "check",
    "url": "https://www.cityofpleasantonca.gov/our-government/boards-commissions/volunteer-in-pleasanton/"
  },
  {
    "id": 37,
    "title": "Care Package Service Projects",
    "organization": "Project Night Night",
    "city": "Tri-Valley / Virtual",
    "category": "Community Service",
    "age": "Check local projects",
    "status": "check",
    "url": "https://www.trivalleyvolunteer.org/get-involved"
  },
  {
    "id": 38,
    "title": "Teens Talk Trash",
    "organization": "East Bay Regional Park District",
    "city": "Livermore / Del Valle",
    "category": "Environment",
    "age": "13–18; verify current session",
    "status": "check",
    "url": "https://apply.ebparks.org/custom/501/opp_details/4130"
  },
  {
    "id": 39,
    "title": "Quarry Lakes Garden and Orchard",
    "organization": "East Bay Regional Park District",
    "city": "Fremont",
    "category": "Environment",
    "age": "Under 18 may need permission",
    "status": "check",
    "url": "https://apply.ebparks.org/custom/501/opp_details/3329"
  },
  {
    "id": 40,
    "title": "Coyote Hills Marsh Restoration",
    "organization": "East Bay Regional Park District",
    "city": "Fremont",
    "category": "Environment",
    "age": "Under 16 with parent; verify",
    "status": "check",
    "url": "https://apply.ebparks.org/custom/501/opp_details/16387"
  },
  {
    "id": 41,
    "title": "Wildlife Volunteer Programs",
    "organization": "East Bay Regional Park District",
    "city": "East Bay",
    "category": "Animals",
    "age": "Check assignment",
    "status": "check",
    "url": "https://www.ebparks.org/volunteer/doc-quacks-wildlife-volunteers"
  },
  {
    "id": 42,
    "title": "Youth Leadership and Teaching",
    "organization": "PLAY Leadership",
    "city": "Tri-Valley",
    "category": "Education",
    "age": "Unverified",
    "status": "lead",
    "url": "https://www.cityofpleasantonca.gov/our-government/boards-commissions/volunteer-in-pleasanton/"
  },
  {
    "id": 43,
    "title": "Community Assistance Projects",
    "organization": "Assistance League of Amador Valley",
    "city": "Tri-Valley",
    "category": "Community Service",
    "age": "Unverified",
    "status": "lead",
    "url": "https://www.cityofpleasantonca.gov/our-government/boards-commissions/volunteer-in-pleasanton/"
  },
  {
    "id": 44,
    "title": "Food Pantry and Community Drives",
    "organization": "MCC East Bay",
    "city": "Pleasanton / Dublin",
    "category": "Food Insecurity",
    "age": "Unverified",
    "status": "lead",
    "url": "https://www.cityofpleasantonca.gov/our-government/boards-commissions/volunteer-in-pleasanton/"
  },
  {
    "id": 45,
    "title": "Community and School Supply Drives",
    "organization": "Seva Commons Foundation",
    "city": "Tri-Valley",
    "category": "Community Service",
    "age": "Unverified",
    "status": "lead",
    "url": "https://www.cityofpleasantonca.gov/our-government/boards-commissions/volunteer-in-pleasanton/"
  },
  {
    "id": 46,
    "title": "Food Waste and Recovery Projects",
    "organization": "PlateToPeople",
    "city": "Tri-Valley",
    "category": "Food Insecurity",
    "age": "Unverified",
    "status": "lead",
    "url": "https://www.cityofpleasantonca.gov/our-government/boards-commissions/volunteer-in-pleasanton/"
  },
  {
    "id": 47,
    "title": "Student-Led Poverty Relief",
    "organization": "Poverty Patch-Up",
    "city": "Tri-Valley",
    "category": "Community Service",
    "age": "Unverified",
    "status": "lead",
    "url": "https://www.cityofpleasantonca.gov/our-government/boards-commissions/volunteer-in-pleasanton/"
  },
  {
    "id": 48,
    "title": "Youth Animal Welfare Projects",
    "organization": "East Bay SPCA",
    "city": "East Bay",
    "category": "Animals",
    "age": "Unverified",
    "status": "lead",
    "url": "https://eastbayspca.org/"
  },
  {
    "id": 49,
    "title": "Local Community Service Directory",
    "organization": "Make a Difference for Pleasanton",
    "city": "Pleasanton",
    "category": "Community Service",
    "age": "Unverified",
    "status": "lead",
    "url": "https://www.cityofpleasantonca.gov/our-government/boards-commissions/volunteer-in-pleasanton/"
  }
]
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
