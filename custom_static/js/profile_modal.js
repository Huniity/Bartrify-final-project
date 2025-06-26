const openBtn2 = document.getElementById('openBtn2');
const overlay2 = document.getElementById('overlay2');
const modal2 = document.getElementById('modal2');
const closeBtn2 = document.getElementById('closeBtn2');

function openModal2() {
    overlay2.classList.add('active');
    modal2.classList.remove('exiting');
    modal2.classList.add('entering');
    overlay2.setAttribute('aria-hidden', 'false');
    modal2.focus();
}

function closeModal2() {
    modal2.classList.remove('entering');
    modal2.classList.add('exiting');
    overlay2.setAttribute('aria-hidden', 'true');
    modal2.addEventListener('animationend', () => {
        overlay2.classList.remove('active');
        modal2.classList.remove('exiting');
    }, {
        once: true
    });
}

openBtn2.addEventListener('click', function(event) {
    event.preventDefault();
    openModal2();
});
closeBtn2.addEventListener('click', closeModal2);
overlay2.addEventListener('click', e => {
    if (e.target === overlay2) closeModal2();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay2.classList.contains('active')) {
        closeModal2();
    }
});


const avatarInput = document.getElementById('avatarInput');

const modalAvatarPreview = document.getElementById('modalAvatarPreview'); 

avatarInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            modalAvatarPreview.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const profileEditForm = document.getElementById('profileEditForm');

    const mainProfileAvatar1 = document.getElementById('avatarPreview1');
    const mainProfileAvatar2 = document.getElementById('avatarPreview2');

    if (profileEditForm) {
        profileEditForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(this);

            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || JSON.stringify(errorData) || 'Server error occurred.');
                    }).catch(() => {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    closeModal2();

                    if (mainProfileAvatar1) {
                        mainProfileAvatar1.src = data.avatar_url;
                    }
                    if (mainProfileAvatar2) {
                        mainProfileAvatar2.src = data.avatar_url;
                    }

                    if (modalAvatarPreview) {
                        modalAvatarPreview.src = data.avatar_url;
                    }

                    const profileNameElement = document.querySelector('.profile-info h2');
                    if (profileNameElement) {
                        profileNameElement.innerText = `${data.first_name} ${data.last_name}`;
                    }

                    const profileLocationElement = document.querySelector('.profile-info p:first-of-type');
                    if (profileLocationElement) {
                        profileLocationElement.innerText = data.location;
                    }

                    profileEditForm.reset();


                } else {
                    if (data.errors) {
                        let errorMessages = [];
                        for (const field in data.errors) {
                            errorMessages.push(`${field}: ${data.errors[field].join(', ')}`);
                        }
                        alert('Validation Error:\n' + errorMessages.join('\n'));
                    } else {
                        alert('Error: ' + data.message);
                    }
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('An error occurred: ' + error.message);
            });
        });
    }

    const passwordToggleIcons = document.querySelectorAll('.password-toggle-icon');
    passwordToggleIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const passwordInput = document.getElementById(targetId);

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}