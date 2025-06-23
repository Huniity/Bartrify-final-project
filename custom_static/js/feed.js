// static/js/feed.js

// --- Modal Elements ---
const profileFeedModal = document.getElementById('profile-feed-modal');
const contactModal = document.getElementById('contact-modal');

// Profile Modal Elements
const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileDescription = document.getElementById('profile-description');
// Add elements for tabs content (tab-services, tab-needed, tab-reviews) if you plan to populate them dynamically

// Contact Modal Elements
const modalUserAvatar = document.getElementById('modal-user-avatar');
const modalUserName = document.getElementById('modal-user-name');
const modalUserRating = document.getElementById('modal-user-rating'); // For stars
const modalUserDescription = document.getElementById('modal-user-description'); // From Service.description
const modalTrade1Icon = document.getElementById('modal-trade1-icon'); // Icon for category
const modalTrade1Title = document.getElementById('modal-trade1-title'); // Category title
const contactForm = document.getElementById('contact-form');
const messageTextarea = document.getElementById('message');

// --- Global Functions to be called from inline HTML (or add event listeners) ---
function openProfileModal(ownerId) {
    // In a real application, you would fetch user details via AJAX
    // For now, we'll try to get data from the clicked card or a global data store

    // Find the service card that has this owner ID
    const serviceCard = document.querySelector(`.card[data-owner-id="${ownerId}"]`);

    if (serviceCard) {
        // Populate profile modal with data from the service card's owner data attributes
        profileAvatar.src = serviceCard.dataset.ownerAvatar || '{% static "img/default-avatar.png" %}';
        profileName.textContent = serviceCard.dataset.ownerName;
        profileDescription.textContent = serviceCard.dataset.ownerBio || 'No bio available.';

        // For tabs content (Serviços Fornecidos, Necessários, Reviews),
        // you would either fetch this data via AJAX based on ownerId
        // or have it pre-loaded and filtered. This is complex and out of scope for
        // a simple merge, so these tabs will remain empty unless you implement their data loading.
        document.getElementById('tab-services').innerHTML = '<p>Loading services...</p>';
        document.getElementById('tab-needed').innerHTML = '<p>Loading needed services...</p>';
        document.getElementById('tab-reviews').innerHTML = '<p>Loading reviews...</p>';

        // Set default active tab
        showTab('tab-services');
        profileFeedModal.style.display = 'flex'; // Use flex for centering
    }
}

function closeProfileModal() {
    profileFeedModal.style.display = 'none';
}

function openContactModal() {
    // This function will now be triggered by the "CONTACT" button inside the service card.
    // The data will be read from the specific button that was clicked.
    // We'll update the event listener to pass the service data directly.
    contactModal.style.display = 'flex'; // Use flex for centering
}

function closeModal() { // Used by the '×' button in contact modal
    contactModal.style.display = 'none';
}

function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        tabContent.style.display = 'none';
    });
    // Deactivate all tabs
    document.querySelectorAll('.tab').forEach(tabButton => {
        tabButton.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabId).style.display = 'block';
    // Activate the clicked tab button
    event.currentTarget.classList.add('active'); // `event.currentTarget` refers to the button clicked
}


// --- Event Listeners on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners for opening Profile Modal (clicking on owner's name)
    document.querySelectorAll('.open-profile-modal-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const ownerId = event.target.dataset.ownerId;
            openProfileModal(ownerId);
        });
    });

    // Event listeners for opening Contact Modal (clicking CONTACT 📩 button)
    document.querySelectorAll('.open-contact-modal-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const serviceId = event.target.dataset.serviceId;
            const serviceCard = event.target.closest('.card'); // Get the parent card

            if (serviceCard) {
                // Populate contact modal with data from the service card
                modalUserAvatar.src = serviceCard.dataset.ownerAvatar || '{% static "img/default-avatar.png" %}';
                modalUserName.textContent = serviceCard.dataset.ownerName;
                modalUserRating.innerHTML = '★★★★☆'; // Hardcoded default rating
                modalUserDescription.textContent = serviceCard.dataset.description; // Service description
                modalTrade1Icon.src = '{% static "img/default-service-icon.png" %}'; // Placeholder for icon
                modalTrade1Title.textContent = serviceCard.dataset.category; // Service category
                
                // You might want to pass serviceId to the contact form's submit handler
                // E.g., contactForm.dataset.serviceId = serviceId;
                openContactModal(); // Show the contact modal
            }
        });
    });

    // Close Modals if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target === profileFeedModal) {
            closeProfileModal();
        }
        if (event.target === contactModal) {
            closeModal();
        }
    });

    // --- Contact Form Submission (inside the contact modal) ---
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = messageTextarea.value;
        // const serviceId = contactForm.dataset.serviceId; // Get service ID if stored
        
        // Here, you would send an AJAX request to your backend to send the message
        console.log(`Sending message: "${message}"`); // Log for demonstration
        // Example:
        /*
        fetch('/api/messages/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                service_id: serviceId, // The ID of the service being contacted about
                recipient_id: serviceCard.dataset.ownerId, // The ID of the user being contacted
                message: message
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Message sent successfully!');
                closeModal();
                contactForm.reset();
            } else {
                alert('Failed to send message.');
            }
        })
        .catch(error => console.error('Error sending message:', error));
        */

        alert('Message sent! (Simulated)');
        closeModal();
        contactForm.reset();
    });

    // --- Filter/Sort (still handled by Django form submission) ---
    // No changes needed here if you rely on Django's GET form submission
    // for filtering and sorting, as implemented in the previous merge.
});