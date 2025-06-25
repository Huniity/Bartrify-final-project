const profileFeedModal = document.getElementById('profile-feed-modal');
const contactModal = document.getElementById('contact-modal');

const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileDescription = document.getElementById('profile-description');

const modalUserAvatar = document.getElementById('modal-user-avatar');
const modalUserName = document.getElementById('modal-user-name');
const modalUserRating = document.getElementById('modal-user-rating');
const modalUserDescription = document.getElementById('modal-user-description');
const modalTrade1Icon = document.getElementById('modal-trade1-icon');
const modalTrade1Title = document.getElementById('modal-trade1-title');
const contactForm = document.getElementById('contact-form');
const messageTextarea = document.getElementById('message');


const categoryMapping = {
  'IT_SUPPORT': 'IT Support & Troubleshooting',
  'GRAPHIC_DESIGN': 'Graphic Design & Branding',
  'WEB_DEV': 'Web Development & Design',
  'LANG_TUTOR': 'Language Tutoring',
  'HOME_REPAIR': 'Home Repair & Maintenance',
  'CLEANING': 'Cleaning Services',
  'PET_SITTING': 'Pet Sitting & Walking',
  'PHOTOGRAPHY': 'Photography & Editing',
  'CONSULTING': 'Business Consulting',
  'FITNESS_COACH': 'Fitness Coaching',
  'EDUCATION': 'Education & Tutoring',
  'HANDICRAFTS': 'Handicrafts & Custom Goods',
};

function openProfileModal(ownerId) {
  const serviceCard = document.querySelector(`.card[data-owner-id="${ownerId}"]`);

  if (serviceCard) {
    profileAvatar.src = serviceCard.dataset.ownerAvatar || '{% static "img/default-avatar.png" %}';
    profileName.textContent = serviceCard.dataset.ownerName;
    profileDescription.textContent = serviceCard.dataset.ownerBio || 'No bio available.';

    document.getElementById('tab-services').innerHTML = '<p>Loading services...</p>';
    document.getElementById('tab-reviews').innerHTML = '<p>Loading reviews...</p>';

    showTab('tab-services');
    profileFeedModal.style.display = 'flex';

    fetchUserServicesById(ownerId); 
  }
}

function closeProfileModal() {
  profileFeedModal.style.display = 'none';
}

function openContactModal() {
  contactModal.style.display = 'flex';
}

function closeModal() {
  contactModal.style.display = 'none';
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tabContent => {
    tabContent.style.display = 'none';
  });

  document.querySelectorAll('.tab').forEach(tabButton => {
    tabButton.classList.remove('active');
  });

  document.getElementById(tabId).style.display = 'block';
  event.currentTarget.classList.add('active');
}

function fetchUserServicesById(userId) {
  const servicesContainer = document.getElementById('tab-services');
  servicesContainer.innerHTML = '<p>Loading services...</p>';

  fetch('/api/services/')
    .then(response => response.json())
    .then(services => {
      const userServices = services.filter(service => service.owner === parseInt(userId));

      if (userServices.length === 0) {
        servicesContainer.innerHTML = '<p>This user has no services.</p>';
        return;
      }

      servicesContainer.innerHTML = '';
      userServices.forEach(service => {
        const card = document.createElement('div');
        card.classList.add('service-card');

        const title = document.createElement('h4');
        title.textContent = service.title;

        const category = document.createElement('p');
        const categoryName = categoryMapping[service.category] || service.category;
        category.textContent = categoryName;

        const desc = document.createElement('p');
        desc.textContent = service.description;

        card.appendChild(title);
        card.appendChild(category);
        card.appendChild(desc);

        servicesContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error loading services:", err);
      servicesContainer.innerHTML = '<p>Error loading services.</p>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.open-profile-modal-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
      const ownerId = event.target.dataset.ownerId;
      openProfileModal(ownerId);
    });
  });

  document.querySelectorAll('.open-contact-modal-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
      const serviceId = event.target.dataset.serviceId;
      const serviceCard = event.target.closest('.card');

      if (serviceCard) {
        modalUserAvatar.src = serviceCard.dataset.ownerAvatar || '{% static "img/default-avatar.png" %}';
        modalUserName.textContent = serviceCard.dataset.ownerName;
        modalUserRating.innerHTML = '★★★★☆';
        modalUserDescription.textContent = serviceCard.dataset.description;
        modalTrade1Icon.src = serviceCard.dataset.categoryImage || '{% static "img/Img-content.png" %}';
        modalTrade1Title.textContent = serviceCard.dataset.category;

        openContactModal();
      }
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target === profileFeedModal) {
      closeProfileModal();
    }
    if (event.target === contactModal) {
      closeModal();
    }
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageTextarea.value;
    console.log(`Sending message: "${message}"`);
    alert('Message sent!');
    closeModal();
    contactForm.reset();
  });
});
