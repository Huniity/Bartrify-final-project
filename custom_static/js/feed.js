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

let currentRecipientId = null; 


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function openProfileModal(ownerId) {
    const serviceCard = document.querySelector(`.card[data-owner-id="${ownerId}"]`);

    if (serviceCard) {
        profileAvatar.src = serviceCard.dataset.ownerAvatar || '{% static "img/default-avatar.png" %}';
        profileName.textContent = serviceCard.dataset.ownerName;
        profileDescription.textContent = serviceCard.dataset.ownerBio || 'No bio available.';

        document.getElementById('tab-services').innerHTML = '<p>Loading services...</p>';
        document.getElementById('tab-needed').innerHTML = '<p>Loading needed services...</p>';
        document.getElementById('tab-reviews').innerHTML = '<p>Loading reviews...</p>';

        showTab('tab-services');
        profileFeedModal.style.display = 'flex';
    }
}

function closeProfileModal() {
    profileFeedModal.style.display = 'none';
}

function openContactModal(recipientUserId, recipientName, recipientAvatar, recipientDescription, recipientRating, tradeIcon, tradeTitle) {
    currentRecipientId = recipientUserId;

    modalUserAvatar.src = recipientAvatar || '{% static "img/default-avatar.png" %}';
    modalUserName.textContent = recipientName;
    modalUserRating.innerHTML = recipientRating || '★★★★☆';
    modalUserDescription.textContent = recipientDescription || 'No description available.';
    modalTrade1Icon.src = tradeIcon || '{% static "img/Img-content.png" %}';
    modalTrade1Title.textContent = tradeTitle || 'Unknown Category';

    contactForm.dataset.receiverId = recipientUserId;

    contactModal.style.display = 'flex';
}

function closeModal() {
    contactModal.style.display = 'none';
    messageTextarea.value = '';
    currentRecipientId = null;
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        tabContent.style.display = 'none';
    });

    document.querySelectorAll('.tab').forEach(tabButton => {
        tabButton.classList.remove('active');
    });

    document.getElementById(tabId).style.display = 'block';
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
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
});