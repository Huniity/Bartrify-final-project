const reviewModal = document.getElementById('reviewPopupOverlay');
const submitReviewBtn = document.getElementById('submit-review-btn');
const serviceIdInput = document.getElementById('service-id');
const revieweeUserIdInput = document.getElementById('reviewee-user-id');

function openReviewModal(serviceId, serviceTitle, requestId, revieweeUserId) {
    const modalTitle = document.querySelector('#reviewPopupModal h2');
    modalTitle.textContent = `Leave a Review for ${serviceTitle}`;

    reviewModal.style.display = 'flex';
    document.getElementById('reviewPopupModal').classList.add('active');

    serviceIdInput.value = serviceId;
    revieweeUserIdInput.value = revieweeUserId;

    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    ratingInputs.forEach(input => input.checked = false);

    // Remove previous click handlers on submit button and add new one
    submitReviewBtn.replaceWith(submitReviewBtn.cloneNode(true));
    const newSubmitReviewBtn = document.getElementById('submit-review-btn');

    newSubmitReviewBtn.addEventListener('click', (event) => submitReview(event, serviceId, requestId, revieweeUserId));
}

function closeReviewModal() {
    reviewModal.style.display = 'none';
    document.getElementById('reviewPopupModal').classList.remove('active');
}

document.getElementById('closeReviewBtn').addEventListener('click', closeReviewModal);
document.getElementById('cancelReviewBtn').addEventListener('click', closeReviewModal);

window.addEventListener('click', function (event) {
    if (event.target === reviewModal) {
        closeReviewModal();
    }
});

function submitReview(event, serviceId, requestId, revieweeUserId) {
    event.preventDefault();

    const rating = document.querySelector('input[name="rating"]:checked')?.value;

    if (!rating) {
        alert('Please select a rating.');
        return;
    }

    const csrftoken = getCookie('csrftoken');

    fetch('/api/reviews/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            service_id: serviceId,
            rating: rating,
            reviewee_user_id: revieweeUserId
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error('Failed to submit review: ' + JSON.stringify(err));
            });
        }
        return response.json();
    })
    .then(data => {
        alert('Your review has been submitted successfully!');
        closeReviewModal();

        const reviewItem = document.querySelector(`[data-request-id="${requestId}"]`);
        if (reviewItem) {
            const status = reviewItem.querySelector('.status');
            const ratingText = reviewItem.querySelector('.time-remaining');
            const reviewBtn = reviewItem.querySelector('.mark-completed-btn');

            if (status) status.textContent = 'Completed';
            if (ratingText) ratingText.textContent = `Rated ${rating}/5`;
            if (reviewBtn) reviewBtn.style.display = 'none';
        }
    })
    .catch(err => {
        console.error('Error submitting review:', err);
        alert('Something went wrong while submitting your review.');
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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mark-completed-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const serviceId = event.target.dataset.serviceId;
            const serviceTitle = event.target.dataset.serviceTitle; 
            const requestId = event.target.dataset.requestId;
            const revieweeUserId = event.target.dataset.revieweeUserId; 
            openReviewModal(serviceId, serviceTitle, requestId, revieweeUserId); 
        });
    });
});