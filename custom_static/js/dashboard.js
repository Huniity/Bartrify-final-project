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

function handleStatusUpdate(requestId, newStatus) {
  const csrftoken = getCookie('csrftoken');
  return fetch(`/api/requests/${requestId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    },
    body: JSON.stringify({ status: newStatus })
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        console.error('Failed to update status:', err);
        alert('Error updating status: ' + (err.detail || response.statusText));
        throw new Error('Failed to update status');
      });
    }
    return response.json();
  })
  .catch(err => {
    console.error('Network or server error:', err);
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
          if (request.status === "pending" || request.status === "in-progress") {
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

                // Status text
                const status = document.createElement('span');
                status.classList.add('status');
                if (request.status === 'pending') {
                  status.classList.add('pending');
                } else if (request.status === 'in-progress') {
                  status.classList.add('in-progress');
                }
                status.textContent = request.status;

                exchangeStatus.appendChild(status);

                // Accept or Complete button
                const actionButton = document.createElement('button');
                actionButton.classList.add('btn-small');

                if (request.status === 'pending') {
                  actionButton.textContent = 'Accept';
                } else if (request.status === 'in-progress') {
                  actionButton.textContent = 'Mark Completed';
                }

                actionButton.addEventListener('click', () => {
                  let nextStatus = null;
                  if (request.status === 'pending') {
                    nextStatus = 'in-progress';
                  } else if (request.status === 'in-progress') {
                    nextStatus = 'completed';
                  }
                  if (nextStatus) {
                    handleStatusUpdate(request.id, nextStatus)
                      .then(updatedRequest => {
                        if (updatedRequest) {
                          fetchActiveRequests();
                          updateCompletedCount();
                        }
                      });
                  }
                });

                exchangeStatus.appendChild(actionButton);

                // Delete button
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn-small', 'btn-danger');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                  const csrftoken = getCookie('csrftoken');
                  fetch(`/api/requests/${request.id}/`, {
                    method: 'DELETE',
                    headers: {
                      'X-CSRFToken': csrftoken
                    }
                  })
                  .then(response => {
                    if (response.ok) {
                      fetchActiveRequests();
                      updateCompletedCount();
                    } else {
                      alert('Failed to delete request');
                    }
                  })
                  .catch(err => {
                    console.error('Error deleting request:', err);
                    alert('Error deleting request');
                  });
                });

                exchangeStatus.appendChild(deleteButton);

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
  completedTabContent.innerHTML = '';

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
                              status.classList.add('completed');
                              status.textContent = request.status || 'Completed';
                              exchangeStatus.appendChild(status);

                              const reviewButton = document.createElement('button');
                              reviewButton.classList.add('mark-completed-btn');
                              reviewButton.classList.add('btn-small');
                              reviewButton.textContent = 'Leave a Review';
                              reviewButton.dataset.serviceId = request.service;
                              reviewButton.dataset.serviceTitle = serviceData.title;
                              reviewButton.dataset.requestId = request.id;
                              reviewButton.dataset.revieweeUserId = request.sender === CURRENT_USER_ID ? request.receiver : request.sender;
                              
                              reviewButton.addEventListener('click', (event) => {
                              const serviceId = event.target.dataset.serviceId;
                              const serviceTitle = event.target.dataset.serviceTitle;
                              const requestId = event.target.dataset.requestId;
                              const revieweeUserId = parseInt(event.target.dataset.revieweeUserId, 10);

                              openReviewModal(serviceId, serviceTitle, requestId, revieweeUserId);
                            });

                              const revieweeId = (request.sender === CURRENT_USER_ID) ? request.receiver : request.sender;
                              fetch(`/api/check-review/?reviewee_user_id=${revieweeId}&service_request=${request.id}`)

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
  

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn-small', 'btn-danger');
            deleteButton.textContent = 'Delete';
  
            deleteButton.addEventListener('click', () => {
              if (confirm('Are you sure you want to delete this service?')) {
                const csrftoken = getCookie('csrftoken');
                fetch(`/api/my-services/${service.id}/`, {
                  method: 'DELETE',
                  headers: {
                    'X-CSRFToken': csrftoken
                  }
                })
                .then(response => {
                  if (response.ok) {
                    fetchUserServices();
                  } else {
                    alert('Failed to delete service');
                  }
                })
                .catch(err => {
                  console.error('Error deleting service:', err);
                  alert('Error deleting service');
                });
              }
            });
  
            exchangeStatus.appendChild(status);
            exchangeStatus.appendChild(deleteButton);
  
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
    const achievementBadgeContainer = document.getElementById('achievementBadgeContainer');
    const activeBadgeContainer = document.getElementById('activeBadgeContainer');

    if (!completedCountStat) {
      console.error('Completed count stat element not found.');
      return;
    }

    fetch('/api/requests/')
      .then(response => response.json())
      .then(data => {
        const completedRequests = data.filter(request => request.status === "completed");
        const activeRequests = data.filter(request => request.status === "pending" || request.status === "in-progress");
        const completedCount = completedRequests.length;
        const activeCount = activeRequests.length;

        const completedValue = completedCountStat.querySelector('.stat-value');
        const activeValue = document.getElementById('activeCountStat').querySelector('.stat-value');
        completedValue.textContent = completedCount;  
        activeValue.textContent = activeCount;

        if (completedCount >= 5) {
          achievementBadgeContainer.classList.remove('hidden');
        } else {
          achievementBadgeContainer.classList.add('hidden');
          }
        if (activeCount >= 3) {
          activeBadgeContainer.classList.remove('hidden');
        } else {
          activeBadgeContainer.classList.add('hidden');
        }
      })
      .catch(err => console.error('Error fetching requests:', err));
  }
  

  function fetchUserRatings() {
    const ratingsAverage1 = document.getElementById('ratingsAverage1');
    const ratingsAverage2 = document.getElementById('ratingsAverage2');
    const ratingsBadgeContainer = document.getElementById('ratingsBadgeContainer');

  
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
          ratingsBadgeContainer.classList.add('hidden');
          return;
        }
  
        if (data.length === 0) {
          ratingsAverage1.textContent = 'No ratings yet';
          ratingsAverage2.textContent = 'No ratings yet';
          ratingsBadgeContainer.classList.add('hidden');
          return;
        }
  
        const total = data.reduce((sum, review) => sum + review.rating, 0);
        const average = (total / data.length).toFixed(1);
  
        ratingsAverage1.textContent = ` ${average}/5`;
        ratingsAverage2.textContent = ` ${average}/5`;

        if (parseFloat(average) >= 4.0) {
                ratingsBadgeContainer.classList.remove('hidden');
        } else {
                ratingsBadgeContainer.classList.add('hidden');
        }
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


  function renderStars(rating, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Star container with ID '${containerId}' not found.`);
        return;
    }

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


function fetchUserRatings() {
    const ratingsAverage1 = document.getElementById('ratingsAverage1');
    const ratingsAverage2 = document.getElementById('ratingsAverage2');
    const userStarsContainer = document.getElementById('userStarsContainer');

    if (!ratingsAverage1 || !ratingsAverage2 || !userStarsContainer) {
        console.error('Ratings elements or star container not found.');
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
                ratingsAverage1.textContent = 'N/A';
                ratingsAverage2.textContent = 'N/A';
                userStarsContainer.innerHTML = '';
                return;
            }

            if (data.length === 0) {
                ratingsAverage1.textContent = 'No ratings yet';
                ratingsAverage2.textContent = 'No ratings yet';
                userStarsContainer.innerHTML = '<p>No ratings yet</p>';
                return;
            }

            const total = data.reduce((sum, review) => sum + review.rating, 0);
            const average = (total / data.length).toFixed(1);

            ratingsAverage1.textContent = `${average}/5`;
            ratingsAverage2.textContent = `${average}/5`;


            renderStars(parseFloat(average), 'userStarsContainer');
        })
        .catch(err => {
            console.error('Error fetching user ratings:', err);
            ratingsAverage1.textContent = 'Error';
            ratingsAverage2.textContent = 'Error';
            userStarsContainer.innerHTML = '<p>Error loading ratings</p>';
        });
}
  function fetchSenderUsername(senderId) {
    return fetch(`/api/users/${senderId}/`)  
        .then(response => response.json())
        .then(user => user.username)
        .catch(err => {
            console.error('Error fetching sender details:', err);
            return 'Unknown';
        });
  }

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

  function handleStatusUpdate(requestId, newStatus) {
    const csrftoken = getCookie('csrftoken');
    return fetch(`/api/requests/${requestId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({ status: newStatus })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          console.error('Failed to update status:', err);
          alert('Error updating status: ' + (err.detail || response.statusText));
          throw new Error('Failed to update status');
        });
      }
      return response.json();
    })
    .catch(err => {
      console.error('Network or server error:', err);
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
            if (request.status === "pending" || request.status === "in-progress") {
              Promise.all([
                fetch(`/api/services/${request.service}/`).then(res => res.json()),
                request.offered_service ? fetch(`/api/services/${request.offered_service}/`).then(res => res.json()) : Promise.resolve(null),
                fetchSenderUsername(request.sender)
              ]).then(([requestedService, offeredService, senderName]) => {
                const exchangeItem = document.createElement('div');
                exchangeItem.classList.add('exchange-item');

                const exchangeInfo = document.createElement('div');
                exchangeInfo.classList.add('exchange-info');
                const title = document.createElement('h4');
                title.textContent = `${requestedService.title}`;

                const subtitle = document.createElement('p');
                subtitle.textContent = `From ${senderName} on ${new Date(request.created_at).toLocaleDateString()}`;
                exchangeInfo.append(title, subtitle);

                const exchangeStatus = document.createElement('div');
                exchangeStatus.classList.add('exchange-status');
                const status = document.createElement('span');
                status.classList.add('status');
                status.textContent = request.status;
                exchangeStatus.appendChild(status);

                if (offeredService) {
                  const offered = document.createElement('p');
                  offered.innerHTML = `<strong>Offered:</strong> ${offeredService.title}`;
                  exchangeInfo.appendChild(offered);
                }

                const actionButton = document.createElement('button');
                actionButton.classList.add('btn-small');
                actionButton.textContent = request.status === 'pending' ? 'Accept' : 'Mark Completed';
                actionButton.addEventListener('click', () => {
                  const nextStatus = request.status === 'pending' ? 'in-progress' : 'completed';
                  handleStatusUpdate(request.id, nextStatus).then(fetchActiveRequests);
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.add('btn-small', 'btn-danger');
                deleteBtn.addEventListener('click', () => {
                  const csrftoken = getCookie('csrftoken');
                  fetch(`/api/requests/${request.id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': csrftoken }
                  }).then(fetchActiveRequests);
                });

                exchangeStatus.append(actionButton, deleteBtn);

                exchangeItem.append(exchangeInfo, exchangeStatus);
                activeTabContent.appendChild(exchangeItem);
              });
            }
          });
        } else {
          activeTabContent.innerHTML = '<p>No active requests.</p>';
        }
      });
  }

  fetchActiveRequests();
  updateCompletedCount();
  fetchUserRatings();
});