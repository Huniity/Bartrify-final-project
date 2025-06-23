// static/js/register.js

// Function to handle card flipping (exposed globally for onclick)
function flipCard() {
    document.getElementById('Container').classList.toggle('flipped');
}
window.flipCard = flipCard; // Make it globally accessible for HTML onclick

// Function to set up password visibility toggles
function setupPasswordToggle(inputId, toggleIconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleIconId);

    if (passwordInput && toggleIcon) {
        toggleIcon.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            // Toggle icon class between eye and eye-slash
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

// Function to get CSRF token from cookies (essential for Django POST requests)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Get the CSRF token once when the script loads
const csrftoken = getCookie('csrftoken');

// --- Main DOMContentLoaded Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Setup password toggles for all password fields
    setupPasswordToggle('password', 'togglePassword'); // Signup password
    setupPasswordToggle('confirmPassword', 'toggleConfirmPassword'); // Signup confirm password
    setupPasswordToggle('password-back', 'togglePasswordBack'); // Login password

    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    // --- Signup Form Submission ---
    if (signupForm) { // Ensure the element exists before adding listener
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent default browser form submission

            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            // Client-side password confirmation check
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return; // Stop the function execution
            }

            const data = {
                username: document.getElementById("username").value,
                email: document.getElementById("email").value,
                password: password, // Use the already validated password
                first_name: document.getElementById("firstName").value, // Changed to match your HTML's firstName id
                last_name: document.getElementById("lastName").value,   // Changed to match your HTML's lastName id
                location: document.getElementById("location").value
            };

            try {
                const res = await fetch("/api/register/", { // Ensure this is your correct backend registration endpoint
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrftoken, // CRITICAL: Include CSRF token
                    },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    alert("Signup successful! Please log in.");
                    signupForm.reset(); // Clear the form fields
                    flipCard(); // Flip to the login side
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

    // --- Login Form Submission ---
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