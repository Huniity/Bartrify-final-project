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
        const serviceItem = document.createElement('div');
        serviceItem.classList.add('service-tab');
        
        serviceItem.innerHTML = `
          <div class="header-text-tab">
            <h4 class="service-title-h4">${service.title}</h4>
            <p class="service-title-p">${categoryMapping[service.category] || service.category}</p>
          </div>
          <div class="service-description-tab">
            <p>${service.description}</p>
          </div>
        `;
        
        servicesContainer.appendChild(serviceItem);
      });
    })
    .catch(err => {
      console.error("Error loading services:", err);
      servicesContainer.innerHTML = '<p>Error loading services.</p>';
    });
}

function fetchReviewsForUser(userId) {
  const reviewsContainer = document.getElementById('tab-reviews');
  reviewsContainer.innerHTML = '<p>Loading reviews...</p>';

  fetch(`/api/reviews/?user_id=${userId}`)
    .then(res => res.json())
    .then(reviews => {
      if (!reviews.length) {
        reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
        return;
      }

      reviewsContainer.innerHTML = '';
      reviews.forEach(review => {
        const reviewEl = document.createElement('div');
        reviewEl.classList.add('review-item');
        reviewEl.innerHTML = `
          <p><strong>${review.username}</strong> rated: ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
          <p><em>${new Date(review.created_at).toLocaleDateString()}</em></p>
        `;
        reviewsContainer.appendChild(reviewEl);
      });
    })
    .catch(err => {
      console.error("Error fetching reviews:", err);
      reviewsContainer.innerHTML = '<p>Error loading reviews.</p>';
    });
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.open-profile-modal-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
      const ownerId = event.target.dataset.ownerId;
      openProfileModal(ownerId);
      fetchReviewsForUser(ownerId);
    });
  });
  const filterForm = document.querySelector('.filter-controls');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const locationSelect = document.getElementById('location-select');
    const sortSelect = document.getElementById('sort-select');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');

    function submitForm() {
        if (filterForm) {
            filterForm.submit();
        }
    }

    if (filterForm) {
        if (categorySelect) categorySelect.addEventListener('change', submitForm);
        if (locationSelect) locationSelect.addEventListener('change', submitForm);
        if (sortSelect) sortSelect.addEventListener('change', submitForm);

        let searchTimeout;
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(submitForm, 500);
            });
        }
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', function() {
                if (searchInput) {
                    searchInput.value = '';
                }
                if (categorySelect) {
                    categorySelect.value = '';
                }
                if (locationSelect) {
                    locationSelect.value = '';
                }
                if (sortSelect) {
                    sortSelect.value = '';
                }
                submitForm();
            });
        }
    }

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
  
        contactForm.dataset.serviceId = serviceId; 
        openContactModal();
      }
    });
  });

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  window.addEventListener('click', (event) => {
    if (event.target === profileFeedModal) {
      closeProfileModal();
    }
    if (event.target === contactModal) {
      closeModal();
    }
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const message = messageTextarea.value.trim();
    const serviceId = contactForm.dataset.serviceId;
  
    if (!message || !serviceId || !CURRENT_USER_ID) {
      alert("Missing required data.");
      return;
    }
  
    const serviceCard = document.querySelector(`.card[data-service-id="${serviceId}"]`);
    if (!serviceCard) {
      alert("Service card not found.");
      return;
    }
  
    const receiverId = serviceCard.dataset.ownerId;
    const csrftoken = getCookie('csrftoken');
  
    try {
      const response = await fetch('/api/requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
          service: parseInt(serviceId, 10),
          receiver: parseInt(receiverId, 10),
          message: message,
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Error:", errorData);
        alert("Failed to send message.");
        return;
      }
  
      alert("Message sent and request created!");
      contactForm.reset();
      closeModal();
  
    } catch (error) {
      console.error("🚨 Request error:", error);
      alert("An unexpected error occurred.");
    }
  });
  
});