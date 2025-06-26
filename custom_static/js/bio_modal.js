const editPopupBtn = document.getElementById('editPopupBtn');
const editPopupOverlay = document.getElementById('editPopupOverlay');
const editPopupModal = document.getElementById('editPopupModal');
const closeBtn3 = document.getElementById('closeBtn3');
const cancelBtn = document.getElementById('editPopupCancelBtn');
const editPopupTextarea = document.getElementById('editPopupTextarea');
const editPopupSaveBtn = document.getElementById('editPopupSaveBtn');
const editableText = document.getElementById('editableText');


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function openEditModal() {
    editPopupTextarea.value = editableText.textContent.trim();
    editPopupOverlay.classList.add('active');
    editPopupModal.classList.remove('exiting');
    editPopupModal.classList.add('entering');
    editPopupOverlay.setAttribute('aria-hidden', 'false');
    editPopupTextarea.focus();
}

function closeEditModal() {
    editPopupModal.classList.remove('entering');
    editPopupModal.classList.add('exiting');
    editPopupOverlay.setAttribute('aria-hidden', 'true');
    editPopupModal.addEventListener('animationend', () => {
        editPopupOverlay.classList.remove('active');
        editPopupModal.classList.remove('exiting');
    }, { once: true });
}

async function saveEdit() {
    const newBio = editPopupTextarea.value;
    const csrfToken = getCookie('csrftoken');

    try {
        const response = await fetch('/api/update-bio/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ bio: newBio }),
        });

        if (response.ok) {
            const data = await response.json();
            editableText.textContent = data.bio;
            console.log('Bio updated successfully:', data.bio);
            closeEditModal();
        } else {
            const errorData = await response.json();
            console.error('Failed to update bio:', errorData.error);
            alert('Failed to update bio: ' + errorData.error);
        }
    } catch (error) {
        console.error('Network or server error:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}


editPopupBtn.addEventListener('click', openEditModal);
closeBtn3.addEventListener('click', closeEditModal);
cancelBtn.addEventListener('click', closeEditModal);
editPopupOverlay.addEventListener('click', e => {
    if (e.target === editPopupOverlay) closeEditModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && editPopupOverlay.classList.contains('active')) {
        closeEditModal();
    }
});
editPopupSaveBtn.addEventListener('click', saveEdit);