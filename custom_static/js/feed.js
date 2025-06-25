document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.querySelector('.filter-controls');
    if (!filterForm) {
        console.warn('Filter form not found. Auto-refresh filters will not work.');
    }

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

    const profileFeedModal = document.getElementById('profile-feed-modal');
    const contactModal = document.getElementById('contact-modal');

    const closeProfileBtn = document.querySelector('.close-btn-profile');
    const closeContactBtn = document.querySelector('.close-btn');


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

    let currentRecipientId = null;

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    function openProfileModal(ownerId) {
        const serviceCard = document.querySelector(`.card[data-owner-id="${ownerId}"]`);

        if (serviceCard) {
            profileAvatar.src = serviceCard.dataset.ownerAvatar || '/static/img/default-avatar.png';
            profileName.textContent = serviceCard.dataset.ownerName;
            profileDescription.textContent = serviceCard.dataset.ownerBio || 'No bio available.';

            if (profileFeedModal) {
                profileFeedModal.dataset.ownerId = ownerId;
                profileFeedModal.dataset.ownerName = serviceCard.dataset.ownerName;
                profileFeedModal.dataset.ownerAvatar = serviceCard.dataset.ownerAvatar;
                profileFeedModal.dataset.ownerDescription = serviceCard.dataset.description;
                profileFeedModal.dataset.ownerRating = serviceCard.dataset.ownerRating || '★★★★☆';
                profileFeedModal.dataset.categoryImage = serviceCard.dataset.categoryImage;
                profileFeedModal.dataset.category = serviceCard.dataset.category;
            }

            document.getElementById('tab-services').innerHTML = '<p>Loading services...</p>';
            document.getElementById('tab-needed').innerHTML = '<p>Loading needed services...</p>';
            document.getElementById('tab-reviews').innerHTML = '<p>Loading reviews...</p>';

            showTab('tab-services');

            if (profileFeedModal) {
                profileFeedModal.style.display = 'flex';
            }
        }
    }

    function closeProfileModal() {
        if (profileFeedModal) {
             profileFeedModal.style.display = 'none';
        }
    }

    function openContactModal(recipientUserId, recipientName, recipientAvatar, recipientDescription, recipientRating, tradeIcon, tradeTitle) {
        currentRecipientId = recipientUserId;

        if (modalUserAvatar) modalUserAvatar.src = recipientAvatar || '/static/img/default-avatar.png';
        if (modalUserName) modalUserName.textContent = recipientName;
        if (modalUserRating) modalUserRating.innerHTML = recipientRating || '★★★★☆';
        if (modalUserDescription) modalUserDescription.textContent = recipientDescription || 'No description available.';
        if (modalTrade1Icon) modalTrade1Icon.src = tradeIcon || '/static/img/Img-content.png';
        if (modalTrade1Title) modalTrade1Title.textContent = tradeTitle || 'Unknown Category';

        if (contactForm) {
            contactForm.dataset.receiverId = recipientUserId;
        }

        if (contactModal) {
            contactModal.style.display = 'flex';
        }
    }

    function closeModal() {
        if (contactModal) {
            contactModal.style.display = 'none';
        }
        if (messageTextarea) {
             messageTextarea.value = '';
        }
        currentRecipientId = null;
    }

    function showTab(tabId, event = null) {
        document.querySelectorAll('.tab-content').forEach(tabContent => {
            tabContent.style.display = 'none';
        });

        document.querySelectorAll('.tab').forEach(tabButton => {
            tabButton.classList.remove('active');
        });

        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.style.display = 'block';
        }

        if (event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        } else {
            const initialActiveTabButton = document.querySelector(`.tab[data-tab-id="${tabId}"]`);
            if (initialActiveTabButton) {
                initialActiveTabButton.classList.add('active');
            }
        }
    }

    document.querySelectorAll('.open-profile-modal-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const ownerId = event.target.dataset.ownerId;
            openProfileModal(ownerId);
        });
    });

    document.querySelectorAll('.open-contact-modal-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const serviceCard = event.target.closest('.card');

            if (serviceCard) {
                const ownerId = serviceCard.dataset.ownerId;
                const ownerName = serviceCard.dataset.ownerName;
                const ownerAvatar = serviceCard.dataset.ownerAvatar;
                const description = serviceCard.dataset.description;
                const categoryImage = serviceCard.dataset.categoryImage;
                const category = serviceCard.dataset.category;
                const ownerRating = serviceCard.dataset.ownerRating;

                openContactModal(ownerId, ownerName, ownerAvatar, description, ownerRating, categoryImage, category);
            }
        });
    });

    const contactFromProfileBtn = document.querySelector('.contact-from-profile-btn');
    if (contactFromProfileBtn) {
        contactFromProfileBtn.addEventListener('click', () => {
            const ownerId = profileFeedModal.dataset.ownerId;
            const ownerName = profileFeedModal.dataset.ownerName;
            const ownerAvatar = profileFeedModal.dataset.ownerAvatar;
            const description = profileFeedModal.dataset.ownerDescription;
            const ownerRating = profileFeedModal.dataset.ownerRating;
            const categoryImage = profileFeedModal.dataset.categoryImage;
            const category = profileFeedModal.dataset.category;

            closeProfileModal();
            openContactModal(ownerId, ownerName, ownerAvatar, description, ownerRating, categoryImage, category);
        });
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', closeProfileModal);
    }

    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target === profileFeedModal) {
            closeProfileModal();
        }
        if (event.target === contactModal) {
            closeModal();
        }
    });

    document.querySelectorAll('.tab').forEach(tabButton => {
        tabButton.addEventListener('click', (event) => {
            const tabId = event.currentTarget.dataset.tabId;
            showTab(tabId, event);
        });
    });

    showTab('tab-services');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const messageContent = messageTextarea.value.trim();
            const recipientId = contactForm.dataset.receiverId;

            if (!messageContent) {
                alert('Please write a message before sending.');
                return;
            }

            if (!recipientId) {
                console.error('Recipient ID is missing from the form data attribute. Cannot send message.');
                alert('Error: Recipient information missing. Please ensure the modal loaded correctly.');
                return;
            }

            const apiUrl = `/chat/create/${recipientId}/`;

            try {
                const data = {
                    message_content: messageContent
                };

                const csrfToken = getCookie('csrftoken');

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || `Server error: ${response.status}`);
                }

                const responseData = await response.json();

                if (responseData.success) {
                    messageTextarea.value = '';
                    closeModal();

                    if (responseData.room_id && responseData.recipient_username) {
                        window.location.href = `/dashboard/?chat_room_id=${responseData.room_id}&chat_username=${encodeURIComponent(responseData.recipient_username)}`;
                    } else {
                        alert('Message sent successfully! Please navigate to your dashboard to view the chat.');
                    }

                } else {
                    alert('Error sending message: ' + (responseData.detail || 'Unknown error.'));
                }

            } catch (error) {
                console.error('AJAX Error sending message:', error);
                alert(`An error occurred: ${error.message}. Please try again.`);
            }
        });
    } else {
        console.warn('Contact form not found. Message sending functionality will not work.');
    }
});