const reviewModalOverlay = document.getElementById('reviewPopupOverlay');
const reviewPopupModal = document.getElementById('reviewPopupModal');
const closeReviewBtn = document.getElementById('closeReviewBtn');
const cancelReviewBtn = document.getElementById('cancelReviewBtn');
const submitReviewBtn = document.getElementById('submit-review-btn');
const serviceIdInput = document.getElementById('service-id');
const revieweeUserIdInput = document.getElementById('reviewee-user-id');

// Helper function to get CSRF token
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

let selectedRatingValue = null;

// Set up click handlers for rating options
function setupRatingSelection() {
    const options = document.querySelectorAll('.rating-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            // Remove .selected from all
            options.forEach(o => o.classList.remove('selected'));

            // Add to clicked one
            option.classList.add('selected');

            // Store selected value
            selectedRatingValue = option.dataset.value;

            // Optional: check the hidden input for semantic purposes
            const radio = document.querySelector(`input[name="rating"][value="${selectedRatingValue}"]`);
            if (radio) radio.checked = true;
        });
    });
}

// Function to open the review modal
function openReviewModal(serviceId, serviceTitle, requestId, revieweeUserId) {
    reviewModalOverlay.style.display = 'flex';
    reviewPopupModal.classList.add('active');

    serviceIdInput.value = serviceId;
    revieweeUserIdInput.value = revieweeUserId;

    // Reset rating UI
    selectedRatingValue = null;
    document.querySelectorAll('.rating-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);

    setupRatingSelection();

    // Replace submit button to clear previous listeners
    const oldSubmitReviewBtn = submitReviewBtn;
    const newSubmitReviewBtn = oldSubmitReviewBtn.cloneNode(true);
    oldSubmitReviewBtn.replaceWith(newSubmitReviewBtn);
    newSubmitReviewBtn.addEventListener('click', (event) => {
        submitReview(event, serviceId, requestId, revieweeUserId);
    });
}

// Function to close the review modal
function closeReviewModal() {
    reviewModalOverlay.style.display = 'none';
    reviewPopupModal.classList.remove('active');
}

// Close modal buttons
closeReviewBtn.addEventListener('click', closeReviewModal);
cancelReviewBtn.addEventListener('click', closeReviewModal);

// Click outside modal closes it
window.addEventListener('click', function (event) {
    if (event.target === reviewModalOverlay) {
        closeReviewModal();
    }
});

// Submit review
async function submitReview(event, requestId, revieweeUserId) {
    event.preventDefault();

    const rating = parseInt(selectedRatingValue, 10);

    if (isNaN(rating)) {
        alert('Please select a rating.');
        return;
    }

    const csrftoken = getCookie('csrftoken');

    try {
        const response = await fetch('/api/reviews/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                rating: rating,
                reviewee_user_id: parseInt(revieweeUserId)
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            let errorMessage = 'Failed to submit review.';
            if (errorData.detail) {
                errorMessage += `\nDetail: ${errorData.detail}`;
            } else {
                for (const key in errorData) {
                    errorMessage += `\n${key}: ${Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key]}`;
                }
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        alert('Your review has been submitted successfully!');
        closeReviewModal();

        // Update card in dashboard
        const reviewItem = document.querySelector(`[data-request-id="${requestId}"]`);
        if (reviewItem) {
            const reviewButton = reviewItem.querySelector('.mark-completed-btn');
            if (reviewButton) {
                reviewButton.remove();
                const exchangeStatus = reviewItem.querySelector('.exchange-status');
                if (exchangeStatus) {
                    const ratingSpan = document.createElement('span');
                    ratingSpan.classList.add('time-remaining');
                    ratingSpan.textContent = `⭐ ${selectedRatingValue}/5`;
                    exchangeStatus.appendChild(ratingSpan);
                }
            }
        }

    } catch (err) {
        console.error('Error submitting review:', err);
        alert(`Something went wrong while submitting your review: ${err.message}`);
    }
}

window.openReviewModal = openReviewModal;
