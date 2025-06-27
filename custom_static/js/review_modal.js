const reviewModalOverlay = document.getElementById('reviewPopupOverlay');
const reviewPopupModal = document.getElementById('reviewPopupModal');
const closeReviewBtn = document.getElementById('closeReviewBtn');
const cancelReviewBtn = document.getElementById('cancelReviewBtn');
const submitReviewBtn = document.getElementById('submit-review-btn');
const serviceIdInput = document.getElementById('service-id');
const revieweeUserIdInput = document.getElementById('reviewee-user-id');


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


function setupRatingSelection() {
    const options = document.querySelectorAll('.rating-option');
    options.forEach(option => {
        option.addEventListener('click', () => {

            options.forEach(o => o.classList.remove('selected'));

            option.classList.add('selected');

            selectedRatingValue = option.dataset.value;

            const radio = document.querySelector(`input[name="rating"][value="${selectedRatingValue}"]`);
            if (radio) radio.checked = true;
        });
    });
}


function openReviewModal(serviceId, serviceTitle, requestId, revieweeUserId) {
    reviewModalOverlay.style.display = 'flex';
    reviewPopupModal.classList.add('active');

    serviceIdInput.value = serviceId;
    revieweeUserIdInput.value = revieweeUserId;


    selectedRatingValue = null;
    document.querySelectorAll('.rating-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);

    setupRatingSelection();


    const oldSubmitReviewBtn = submitReviewBtn;
    const newSubmitReviewBtn = oldSubmitReviewBtn.cloneNode(true);
    oldSubmitReviewBtn.replaceWith(newSubmitReviewBtn);
    newSubmitReviewBtn.addEventListener('click', (event) => {
        submitReview(event, serviceId, requestId, revieweeUserId);
    });
}

function closeReviewModal() {
    reviewModalOverlay.style.display = 'none';
    reviewPopupModal.classList.remove('active');
}


closeReviewBtn.addEventListener('click', closeReviewModal);
cancelReviewBtn.addEventListener('click', closeReviewModal);


window.addEventListener('click', function (event) {
    if (event.target === reviewModalOverlay) {
        closeReviewModal();
    }
});


async function submitReview(event, requestId) {
    event.preventDefault();

    const rating = parseInt(selectedRatingValue, 10);
    const revieweeUserId = parseInt(document.getElementById('reviewee-user-id').value, 10);

    if (isNaN(rating)) {
        showInfoToast("Missing Rating");
        return;
    }

    if (isNaN(revieweeUserId)) {
        showErrorToast("Invalid user");
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
                reviewee_user_id: revieweeUserId 
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
        showSuccessToast("Thank you for the Feedback!");
        closeReviewModal();

        const reviewItem = document.querySelector(`[data-request-id="${requestId}"]`);
        if (reviewItem) {
            const reviewButton = reviewItem.querySelector('.mark-completed-btn');
            if (reviewButton) {
                reviewButton.remove();
                const exchangeStatus = reviewItem.querySelector('.exchange-status');
                if (exchangeStatus) {
                    const ratingSpan = document.createElement('span');
                    ratingSpan.classList.add('time-remaining');
                    ratingSpan.textContent = `тнР ${selectedRatingValue}/5`;
                    exchangeStatus.appendChild(ratingSpan);
                }
            }
        }

    } catch (err) {
        showErrorToast("Please try again");
    }
}

window.openReviewModal = openReviewModal;
