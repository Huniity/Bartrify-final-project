# Bartrify

Bartrify is a digital platform where users can exchange services for free. It fosters a community built on trust, skill-sharing, and collaboration.

---

## 📌 Features

- 👤 User registration, login, and profile editing
- 🔄 Post and browse service listings
- ✉️ Private messaging between users
- 🌟 Leave and receive reviews (text + star rating)
- 📊 Dashboard with user stats and service metrics
- 🛠 Modal-based interface for contact, messaging, reviews, and comments

---

## 🏗 Tech Stack

- **Backend**: Django 4+, Django REST Framework
- **Database**: PostgreSQL
- **Frontend**: Django Templates + Tailwind CSS (or your CSS framework)
- **Hosting**: Render / Railway (backend), Vercel (frontend, optional)

---

## 🗂 Project Structure

```plaintext
bartrify/
├── core/            # Landing page, base templates, global settings
├── users/           # Signup, login, dashboard, edit profile
├── services/        # Service creation, feed, service detail
├── messages/        # User-to-user messages & contact modals
├── reviews/         # Comments and reviews
├── static/          # Static files (CSS, JS, images)
├── templates/       # Optional global templates
├── manage.py
├── requirements.txt
└── README.md