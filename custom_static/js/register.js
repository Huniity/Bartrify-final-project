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
    if (loginForm) { // Ensure the element exists before adding listener
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent default browser form submission

            const data = {
                username: document.getElementById("login-username").value, // Matches the login form's username ID
                password: document.getElementById("password-back").value // Matches the login form's password ID
            };

            try {
                const res = await fetch("/api/auth/login/", { // Ensure this is your correct backend login endpoint (e.g., Djoser's)
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrftoken, // CRITICAL: Include CSRF token
                    },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    const tokens = await res.json();
                    localStorage.setItem("access_token", tokens.access);
                    // Djoser's default /token/login/ endpoint usually returns 'auth_token' directly,
                    // but if you're using simplejwt, it returns 'access' and 'refresh'.
                    // Adjust based on what your /api/auth/login/ endpoint actually returns.
                    if (tokens.refresh) { // Store refresh token if available (for JWT)
                        localStorage.setItem("refresh_token", tokens.refresh);
                    } else if (tokens.auth_token) { // For Token authentication (Djoser's default)
                        localStorage.setItem("auth_token", tokens.auth_token);
                    }
                    
                    alert("Login successful!");
                    loginForm.reset(); // Clear the form fields
                    window.location.href = "/feed/"; // Redirect to the feed page
                } else {
                    const errorData = await res.json();
                    let errorMessage = "Login failed: ";
                    if (errorData && errorData.detail) { // Common for Djoser errors
                        errorMessage += errorData.detail;
                    } else if (errorData) {
                         for (const key in errorData) {
                            errorMessage += `\n${key}: ${Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key]}`;
                        }
                    } else {
                        errorMessage += "Invalid credentials or unknown error.";
                    }
                    alert(errorMessage);
                    console.error("Login error details:", errorData);
                }
            } catch (error) {
                console.error("Network or fetch error during login:", error);
                alert("A network error occurred during login. Please try again.");
            }
        });
    }
});