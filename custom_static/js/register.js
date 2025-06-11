function flipCard() {
    document.getElementById('Container').classList.toggle('flipped');
}

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

document.addEventListener('DOMContentLoaded', () => {
    setupPasswordToggle('password', 'togglePassword');
    setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');
    setupPasswordToggle('password-back', 'togglePasswordBack');

    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            location: document.getElementById("location").value
        };

        const res = await fetch("/api/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("Signup successful! Please log in.");
            flipCard();
        } else {
            const error = await res.json();
            alert("Signup failed: " + JSON.stringify(error));
        }
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            username: document.getElementById("login-username").value,
            password: document.getElementById("password-back").value
        };

        const res = await fetch("/api/auth/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            const tokens = await res.json();
            localStorage.setItem("access_token", tokens.access);
            localStorage.setItem("refresh_token", tokens.refresh);
            alert("Login successful!");
            window.location.href = "/feed/";
        } else {
            const error = await res.json();
            alert("Login failed: " + JSON.stringify(error));
        }
    });
});