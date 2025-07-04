let currentProfileUserId = null;

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

const myServiceSelect = document.getElementById('my-service-select');
const theirServiceSelect = document.getElementById('their-service-select');


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
  currentProfileUserId = ownerId;
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
  if (tabId === 'tab-reviews' && currentProfileUserId) {
    fetchReviewsForUser(currentProfileUserId);
  }
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

function renderStars(rating, container) {
  container.innerHTML = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = (rating % 1) >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement('i');
    star.classList.add('fas', 'fa-star');
    container.appendChild(star);
  }

  if (hasHalfStar) {
    const halfStar = document.createElement('i');
    halfStar.classList.add('fas', 'fa-star-half-stroke');
    container.appendChild(halfStar);
  }

  for (let i = 0; i < emptyStars; i++) {
    const emptyStar = document.createElement('i');
    emptyStar.classList.add('far', 'fa-star');
    container.appendChild(emptyStar);
  }
}

// --- EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.open-profile-modal-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
      const ownerId = event.target.dataset.ownerId;
      openProfileModal(ownerId);
      fetchReviewsForUser(ownerId);
    });
  });
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const filterForm = document.querySelector('form'); // Replace with the specific form selector if needed

  if (resetFiltersBtn && filterForm) {
    resetFiltersBtn.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default form submission
      filterForm.reset(); // Reset all form fields to their default values

      // Remove query parameters from the URL to reset filters
      const url = new URL(window.location.href);
      url.search = ''; // Clear all query parameters
      window.location.href = url.toString(); // Reload the page with the cleared URL
    });
  }
  document.querySelectorAll('.open-contact-modal-btn').forEach(btn => {
  btn.addEventListener('click', async (event) => {
    const serviceId = event.target.dataset.serviceId;
    const serviceCard = event.target.closest('.card');

    if (!serviceCard) return;

  
    modalUserAvatar.src = serviceCard.dataset.ownerAvatar || '{% static "img/default-avatar.png" %}';
    modalUserName.textContent = serviceCard.dataset.ownerName;
    modalUserDescription.textContent = serviceCard.dataset.description || '';
    modalTrade1Icon.src = serviceCard.dataset.categoryImage || '{% static "img/Img-content.png" %}';
    modalTrade1Title.textContent = serviceCard.dataset.category;

    contactForm.dataset.serviceId = serviceId;

    const ownerId = serviceCard.dataset.ownerId;

  
    myServiceSelect.innerHTML = '<option value="">Dont´t offer any Service</option>';
    theirServiceSelect.innerHTML = '<option disabled selected>Loading all the bartrs!.</option>';

    try {
      // Fetch their services and your services
      const [theirResponse, myResponse] = await Promise.all([
        fetch(`/api/services/?owner=${ownerId}`),
        fetch('/api/my-services/')
      ]);

      const theirServices = await theirResponse.json();
      const myServices = await myResponse.json();

      // Populate "their services"
      theirServiceSelect.innerHTML = '';
      if (theirServices.length === 0) {
        theirServiceSelect.innerHTML = '<option disabled selected>No services available!</option>';
      } else {
        theirServices.forEach(service => {
          const opt = document.createElement('option');
          opt.value = service.id;
          opt.textContent = service.title;
          theirServiceSelect.appendChild(opt);
        });

        if (serviceId) {
          theirServiceSelect.value = serviceId;
        }
      }

      myServices.forEach(service => {
        const opt = document.createElement('option');
        opt.value = service.id;
        opt.textContent = service.title;
        myServiceSelect.appendChild(opt);
      });

    } catch (err) {
      console.error("Erro ao carregar serviços para troca:", err);
      theirServiceSelect.innerHTML = '<option disabled selected>Fasiled to Fetch!</option>';
    }

    openContactModal();
  });
});

  contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = messageTextarea.value.trim();
  const serviceId = contactForm.dataset.serviceId;
  const serviceCard = document.querySelector(`.card[data-service-id="${serviceId}"]`);
  const receiverId = serviceCard.dataset.ownerId;
  const csrftoken = getCookie('csrftoken');
  const offeredServiceId = myServiceSelect.value;
  const targetServiceId = theirServiceSelect.value || serviceId;

  try {
    // Step 1: Create service request (if one is being offered)
    const requestPayload = {
      service: parseInt(targetServiceId, 10),
      message: message,
      receiver: parseInt(receiverId, 10),
    };
    if (offeredServiceId) {
      requestPayload.offered_service = parseInt(offeredServiceId, 10);
    }

    const response = await fetch('/api/requests/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erro ao enviar pedido de troca:", errorData);
      alert("Erro ao enviar pedido.");
      return;
    }

    // Step 2: Create chat (if there's a message)
    if (message) {
      const chatResponse = await fetch(`/chat/create/${receiverId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ message_content: message })
      });

      const chatData = await chatResponse.json();
      if (chatData.success && chatData.room_id) {
        // Step 3: Redirect to chat
        document.cookie = "openRoomOnce=1; path=/";
        window.location.href = `/dashboard/?room_id=${chatData.room_id}`;
        return;
      } else {
        console.warn("Chat created but no room_id received.");
      }
    }

    alert("Pedido enviado com sucesso.");
    contactForm.reset();
    closeModal();

  } catch (error) {
    console.error("Erro ao submeter formulário:", error);
    alert("Erro inesperado ao enviar o pedido.");
  }
});

  document.querySelectorAll('.card').forEach(card => {
    const ownerRating = parseFloat(card.dataset.ownerRating);
    const starsContainer = card.querySelector('.stars');
    if (!isNaN(ownerRating) && starsContainer) {
      renderStars(ownerRating, starsContainer);
    } else if (starsContainer) {
      starsContainer.innerHTML = '';
    }
  });

  window.addEventListener('click', (event) => {
    if (event.target === profileFeedModal) closeProfileModal();
    if (event.target === contactModal) closeModal();
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
