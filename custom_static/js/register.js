function flipCard() {
    document.getElementById('Container').classList.toggle('flipped');
}
window.flipCard = flipCard;

function setupPasswordToggle(inputId, toggleIconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleIconId);

    if (passwordInput && toggleIcon) {
        toggleIcon.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

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

const csrftoken = getCookie('csrftoken');


document.addEventListener('DOMContentLoaded', () => {

    setupPasswordToggle('password', 'togglePassword');
    setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');
    setupPasswordToggle('password-back', 'togglePasswordBack');

    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    if (signupForm) { 
            signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            const data = {
                username: document.getElementById("username").value,
                email: document.getElementById("email").value,
                password: password,
                first_name: document.getElementById("firstName").value,
                last_name: document.getElementById("lastName").value,
                location: document.getElementById("location").value
            };

            try {
                const res = await fetch("/api/register/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    alert("Signup successful! Please log in.");
                    signupForm.reset();
                    flipCard();
                } else {
                    const errorData = await res.json();
                    let errorMessage = "Signup failed: ";
                    if (errorData) {
                        for (const key in errorData) {
                            errorMessage += `\n${key}: ${Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key]}`;
                        }
                    } else {
                        errorMessage += "Unknown error.";
                    }
                    alert(errorMessage);
                    console.error("Signup error details:", errorData);
                }
            } catch (error) {
                console.error("Network or fetch error during signup:", error);
                alert("A network error occurred during signup. Please try again.");
            }
        });
    }

    if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            username: document.getElementById("login-username").value,
            password: document.getElementById("password-back").value
        };

        try {
            const res = await fetch("/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok && result.success) {
                loginForm.reset();
                window.location.href = result.redirect || "/dashboard/";
            } else {
                alert(result.error || "Login failed. Please try again.");
                console.error("Login error:", result);
            }
        } catch (error) {
            console.error("Network error during login:", error);
            alert("A network error occurred during login. Please try again.");
        }
    });
}

});