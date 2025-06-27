const reviewModalOverlay = document.getElementById('reviewPopupOverlay');
const reviewPopupModal = document.getElementById('reviewPopupModal');
const closeReviewBtn = document.getElementById('closeReviewBtn');
const cancelReviewBtn = document.getElementById('cancelReviewBtn');
const submitReviewBtn = document.getElementById('submit-review-btn');
const serviceIdInput = document.getElementById('service-id');
const revieweeUserIdInput = document.getElementById('reviewee-user-id');
const requestIdInput = document.getElementById('request-id');


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


async function submitReview(event, serviceId, requestId, revieweeUserId) {
    event.preventDefault();

    const rating = parseInt(selectedRatingValue, 10);
    const csrftoken = getCookie('csrftoken');

    if (isNaN(rating)) {
        showInfoToast("Please select a rating.");
        return;
    }

    const parsedRevieweeUserId = parseInt(revieweeUserId, 10);
    const parsedRequestId = parseInt(requestId, 10);

    if (isNaN(parsedRevieweeUserId) || isNaN(parsedRequestId)) {
        // showErrorToast("Invalid user or request ID. Please try again.");
        return;
    }

    try {
        const response = await fetch('/api/reviews/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                rating: rating,
                reviewee_user_id: parsedRevieweeUserId,
                service_request: parsedRequestId
            })
        });

        let data;

        if (!response.ok) {
            const contentType = response.headers.get("Content-Type");
            let errorData = {};

            if (contentType && contentType.includes("application/json")) {
                errorData = await response.json().catch(() => ({}));
            }

            let errorMessage = 'Failed to submit review.';

            if (errorData.detail) {
                errorMessage = errorData.detail; 
            } else if (errorData.error) {
                errorMessage = errorData.error;
            } else {
                for (const key in errorData) {
                    errorMessage += `\n${key}: ${Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key]}`;
                }
            }
            throw new Error(errorMessage);
        } else {
            try {
                data = await response.json();
            } catch (jsonParseError) {
                console.warn("Review submitted successfully");
                data = {};
            }
        }

        showSuccessToast("Thank you for the Feedback!");
        closeReviewModal();

        await fetchCompletedRequests();
        await fetchUserRatings(); 


        const reviewItem = document.querySelector(`[data-request-id="${requestId}"]`);
        if (reviewItem) {
            const reviewButton = reviewItem.querySelector('.mark-completed-btn');
            if (reviewButton) {
                reviewButton.remove();
                const exchangeStatus = reviewItem.querySelector('.exchange-status');
                if (exchangeStatus) {
                    const starContainer = document.createElement('div');
                    starContainer.classList.add('star-rating', 'flex', 'gap-1');
                    renderStars(parseFloat(selectedRatingValue), starContainer);
                    exchangeStatus.appendChild(starContainer);
                }
            }
        }

    } catch (err) {
        console.error("Error in submitReview:", err);
        // showErrorToast(err.message || "An unknown error occurred. Please try again.");
    }
}


window.openReviewModal = openReviewModal;
