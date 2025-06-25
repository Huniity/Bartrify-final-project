document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('servicesChart').getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 180);
  gradient.addColorStop(0, '#f87d6f');
  gradient.addColorStop(1, '#2d3748');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Services Completed',
        data: [8, 12, 15, 14, 18, 22],
        backgroundColor: gradient,
        borderColor: '#cb6089',
        borderWidth: 1,
        borderRadius: 6,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: { stepSize: 5, font: { size: 9 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 9 } }
        }
      }
    }
  });

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      tabPanes.forEach(pane => pane.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');

      if (tabId === 'active') {
        fetchActiveRequests();
      } else if (tabId === 'completed') {
        fetchCompletedRequests();
      } else if (tabId === 'services') {
        fetchUserServices();
      }
    });
  });

  function fetchSenderUsername(senderId) {
    return fetch(`/api/users/${senderId}/`)  
        .then(response => response.json())
        .then(user => user.username)
        .catch(err => {
            console.error('Error fetching sender details:', err);
            return 'Unknown';
        });
}

  function fetchActiveRequests() {
    const activeTabContent = document.getElementById('active');
    activeTabContent.innerHTML = '';

    fetch('/api/requests/')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                data.forEach(request => {
                    if (request.status === "pending") {
                        fetch(`/api/services/${request.service}/`)
                            .then(serviceResponse => serviceResponse.json())
                            .then(serviceData => {
                                const exchangeItem = document.createElement('div');
                                exchangeItem.classList.add('exchange-item');

                                const exchangeInfo = document.createElement('div');
                                exchangeInfo.classList.add('exchange-info');

                                const serviceAvatar = document.createElement('div');
                                serviceAvatar.classList.add('service-avatar');
                                serviceAvatar.style.backgroundColor = '#4caf50';
                                const icon = document.createElement('i');
                                icon.classList.add('fa-solid', 'fa-leaf');
                                serviceAvatar.appendChild(icon);

                                const serviceDetails = document.createElement('div');
                                const serviceTitle = document.createElement('h4');
                                serviceTitle.textContent = serviceData.title;

                                const serviceDate = document.createElement('p');
                                const formattedDate = new Date(request.created_at).toLocaleDateString();

                                fetchSenderUsername(request.sender)
                                    .then(username => {
                                        serviceDate.textContent = `With: ${username} · ${formattedDate}`;
                                    });

                                serviceDetails.appendChild(serviceTitle);
                                serviceDetails.appendChild(serviceDate);

                                exchangeInfo.appendChild(serviceAvatar);
                                exchangeInfo.appendChild(serviceDetails);

                                const exchangeStatus = document.createElement('div');
                                exchangeStatus.classList.add('exchange-status');
                                const status = document.createElement('span');
                                status.classList.add('status', 'in-progress');
                                status.textContent = request.status || 'In Progress';
                                exchangeStatus.appendChild(status);

                                exchangeItem.appendChild(exchangeInfo);
                                exchangeItem.appendChild(exchangeStatus);

                                activeTabContent.appendChild(exchangeItem);
                            })
                            .catch(err => console.error('Error fetching service details:', err));
                    }
                });
            } else {
                activeTabContent.innerHTML = '<p>No active requests.</p>';
            }
        })
        .catch(err => console.error('Error fetching active requests:', err));
}

function fetchCompletedRequests() {
  const completedTabContent = document.getElementById('completed');
  completedTabContent.innerHTML = ''; // Clear previous content

  fetch('/api/requests/')
      .then(response => response.json())
      .then(data => {
          if (data.length > 0) {
              data.forEach(request => {
                  if (request.status === "completed") {
                      fetch(`/api/services/${request.service}/`)
                          .then(serviceResponse => serviceResponse.json())
                          .then(serviceData => {
                              const exchangeItem = document.createElement('div');
                              exchangeItem.classList.add('exchange-item');
                              exchangeItem.setAttribute('data-request-id', request.id);
                              const exchangeInfo = document.createElement('div');
                              exchangeInfo.classList.add('exchange-info');

                              const serviceAvatar = document.createElement('div');
                              serviceAvatar.classList.add('service-avatar');
                              serviceAvatar.style.backgroundColor = '#00bcd4';
                              const icon = document.createElement('i');
                              icon.classList.add('fa-solid', 'fa-broom');
                              serviceAvatar.appendChild(icon);

                              const serviceDetails = document.createElement('div');
                              const serviceTitle = document.createElement('h4');
                              serviceTitle.textContent = serviceData.title;

                              const serviceDate = document.createElement('p');
                              const formattedDate = new Date(request.created_at).toLocaleDateString();

                              fetchSenderUsername(request.sender)
                                  .then(username => {
                                      serviceDate.textContent = `With: ${username} · ${formattedDate}`;
                                  });

                              serviceDetails.appendChild(serviceTitle);
                              serviceDetails.appendChild(serviceDate);

                              exchangeInfo.appendChild(serviceAvatar);
                              exchangeInfo.appendChild(serviceDetails);

                              const exchangeStatus = document.createElement('div');
                              exchangeStatus.classList.add('exchange-status');
                              const status = document.createElement('span');
                              status.classList.add('status');
                              status.textContent = request.status || 'Completed';
                              exchangeStatus.appendChild(status);

                              // Initial "Leave a Review" button (before review is left)
                              const reviewButton = document.createElement('button');
                              reviewButton.classList.add('mark-completed-btn');
                              reviewButton.textContent = 'Leave a Review';
                              reviewButton.dataset.serviceId = request.service;
                              reviewButton.dataset.serviceTitle = serviceData.title;
                              reviewButton.dataset.requestId = request.id;
                              reviewButton.dataset.revieweeUserId = request.sender;  // Review the sender (user who completed the service)
                              
                              reviewButton.addEventListener('click', (event) => {
                                  const serviceId = event.target.dataset.serviceId;
                                  const serviceTitle = event.target.dataset.serviceTitle;
                                  const requestId = event.target.dataset.requestId;
                                  const revieweeUserId = event.target.dataset.revieweeUserId;
                                  openReviewModal(serviceId, serviceTitle, requestId, revieweeUserId); // Pass revieweeUserId to modal
                              });

                              fetch(`/api/check-review/?reviewee_user_id=${request.sender}`)
                                .then(res => res.json())
                                .then(reviewData => {
                                  if (reviewData.reviewed) {
                                    const rating = document.createElement('span');
                                    rating.classList.add('time-remaining');
                                    rating.textContent = `⭐ ${reviewData.rating}/5`;
                                    exchangeStatus.appendChild(rating);
                                  } else {
                                    exchangeStatus.appendChild(reviewButton);
                                  }

                                  exchangeItem.appendChild(exchangeInfo);
                                  exchangeItem.appendChild(exchangeStatus);
                                  completedTabContent.appendChild(exchangeItem);
                                })
                                .catch(err => {
                                  console.error('Error checking review status:', err);
                                  // Fallback: still show the review button if check fails
                                  exchangeStatus.appendChild(reviewButton);
                                  exchangeItem.appendChild(exchangeInfo);
                                  exchangeItem.appendChild(exchangeStatus);
                                  completedTabContent.appendChild(exchangeItem);
                                });
                          })
                          .catch(err => console.error('Error fetching service details:', err));
                  }
              });
          } else {
              completedTabContent.innerHTML = '<p>No completed requests.</p>';
          }
      })
      .catch(err => console.error('Error fetching completed requests:', err));
}



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

  function fetchUserServices() {
    const servicesTabContent = document.getElementById('services');
    servicesTabContent.innerHTML = '';

    fetch('/api/my-services/')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          data.forEach(service => {
            const exchangeItem = document.createElement('div');
            exchangeItem.classList.add('exchange-item');
            
            const exchangeInfo = document.createElement('div');
            exchangeInfo.classList.add('exchange-info');
            
            const serviceAvatar = document.createElement('div');
            serviceAvatar.classList.add('service-avatar');
            serviceAvatar.style.backgroundColor = '#4caf50';
            
            const icon = document.createElement('i');
            icon.classList.add('fa-solid', 'fa-leaf');
            serviceAvatar.appendChild(icon);
            
            const serviceDetails = document.createElement('div');
            
            const serviceTitle = document.createElement('h4');
            serviceTitle.textContent = service.title;
            
            const serviceCategory = document.createElement('p');
            const categoryName = categoryMapping[service.category];
            serviceCategory.textContent = `${categoryName}`;
            
            serviceDetails.appendChild(serviceTitle);
            serviceDetails.appendChild(serviceCategory);
            
            exchangeInfo.appendChild(serviceAvatar);
            exchangeInfo.appendChild(serviceDetails);
            
            const exchangeStatus = document.createElement('div');
            exchangeStatus.classList.add('exchange-status');
            
            const status = document.createElement('span');
            status.classList.add('status', 'in-progress');
            status.textContent = 'Active';
            
            const editButton = document.createElement('button');
            editButton.classList.add('btn-small');
            editButton.textContent = 'Edit';
            
            exchangeStatus.appendChild(status);
            exchangeStatus.appendChild(editButton);
            
            exchangeItem.appendChild(exchangeInfo);
            exchangeItem.appendChild(exchangeStatus);
            
            servicesTabContent.appendChild(exchangeItem);
          });
        } else {
          servicesTabContent.innerHTML = '<p>You haven\'t created any services yet.</p>';
        }
      })
      .catch(err => console.error('Error fetching user services:', err));
  }

  function updateCompletedCount() {
    const completedCountStat = document.getElementById('completedCountStat');
    
    if (!completedCountStat) {
      console.error('Completed count stat element not found.');
      return;
    }

    fetch('/api/requests/')
      .then(response => response.json())
      .then(data => {
        const completedRequests = data.filter(request => request.status === "completed");
        const activeRequests = data.filter(request => request.status === "pending");
        const completedCount = completedRequests.length;
        const activeCount = activeRequests.length;

        const completedValue = completedCountStat.querySelector('.stat-value');
        const activeValue = document.getElementById('activeCountStat').querySelector('.stat-value');
        completedValue.textContent = completedCount;  
        activeValue.textContent = activeCount;
      })
      .catch(err => console.error('Error fetching requests:', err));
  }
  

  function fetchUserRatings() {
    const ratingsAverage1 = document.getElementById('ratingsAverage1');
    const ratingsAverage2 = document.getElementById('ratingsAverage2');
  
    if (!ratingsAverage1 || !ratingsAverage2) {
      console.error('Ratings elements not found.');
      return;
    }
  
    fetch('/api/my-reviews/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('Unexpected data format for reviews:', data);
          ratingsAverage1.textContent = 'No ratings yet';
          ratingsAverage2.textContent = 'No ratings yet';
          return;
        }
  
        if (data.length === 0) {
          ratingsAverage1.textContent = 'No ratings yet';
          ratingsAverage2.textContent = 'No ratings yet';
          return;
        }
  
        // Calculate average rating
        const total = data.reduce((sum, review) => sum + review.rating, 0);
        const average = (total / data.length).toFixed(1);
  
        ratingsAverage1.textContent = ` ${average}/5`;
        ratingsAverage2.textContent = ` ${average}/5`;
      })
      .catch(err => {
        console.error('Error fetching user ratings:', err);
        ratingsAverage1.textContent = 'Error loading';
        ratingsAverage2.textContent = 'Error loading';
      });
  }
  

  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("room_id");
  if (roomId) {
    const roomElem = document.getElementById(`room-${roomId}`);
    if (roomElem) roomElem.click();
  } else {
    const firstRoom = document.querySelector('#roomList .chat-button');
    if (firstRoom) firstRoom.click();
  }

  fetchActiveRequests();
  updateCompletedCount();
  fetchUserRatings();
});
