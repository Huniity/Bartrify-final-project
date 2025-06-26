const feedData = [
    {
        name: "Laura Silva",
        trade1: { title: "Baby Products", icon: "/static/img/1.png" },
        trade2: { title: "Eco Friendly", icon: "/static/img/10.png" },
        description: "High-quality strollers and baby accessories. Comfort and safety first.",
        rating: 5,
        reviews: 36,
        location: "Lisbon",
        category: "Baby Products",
        image: "/static/img/1.png",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Laura",
        userReviews: [
            { name: "Mariana S", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mariana", rating: 5 },
            { name: "João P", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=João", rating: 3 },
            { name: "Ana L", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ana", rating: 5 },
            { name: "Mariana S", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mariana", rating: 5 },
            { name: "João P", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=João", rating: 3 },
            { name: "Ana L", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ana", rating: 5 },
            { name: "Mariana S", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mariana", rating: 5 },
            { name: "João P", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=João", rating: 3 },
            { name: "Mariana S", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mariana", rating: 5 },
            { name: "João P", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=João", rating: 3 },
            { name: "Ana L", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ana", rating: 5 },
            { name: "Mariana S", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mariana", rating: 5 },
            { name: "João P", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=João", rating: 3 },
            { name: "Ana L", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ana", rating: 5 },
            { name: "Mariana S", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mariana", rating: 5 },
            { name: "João P", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=João", rating: 3 },
            { name: "Ana L", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ana", rating: 5 }
        ]
    },
    {
        name: "Miguel Costa",
        trade1: { title: "Cleaning Services", icon: "/static/img/2.png" },
        trade2: { title: "Flexible Hours", icon: "/static/img/9.png" },
        description: "Professional home and office cleaning. Flexible hours and reliable results.",
        rating: 4,
        reviews: 22,
        location: "Porto",
        category: "Cleaning Services",
        image: "/static/img/2.png",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Miguel",
        userReviews: [
            { name: "Tiago D.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Tiago", rating: 5 },
            { name: "Vanda R.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vanda", rating: 4 },
            { name: "Nuno F.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Nuno", rating: 5 }
        ]
    },
    {
        name: "Sara Marques",
        trade1: { title: "Computer Repair", icon: "/static/img/3.png" },
        trade2: { title: "Retro Expert", icon: "/static/img/8.png" },
        description: "Retro PC repairs and parts for classic models. Perfect for collectors.",
        rating: 3,
        reviews: 14,
        location: "Coimbra",
        category: "Computer Repair",
        image: "/static/img/3.png",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sara",
        userReviews: [
            { name: "Marta G.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marta", rating: 5 },
            { name: "Pedro E.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pedro", rating: 5 },
            { name: "Filipa B.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Filipa", rating: 5 }
        ]
    },
    {
        name: "Bruno Almeida",
        trade1: { title: "Dog Walking", icon: "/static/img/4.png" },
        trade2: { title: "Weekend Service", icon: "/static/img/7.png" },
        description: "Friendly and caring dog walking service. Daily and weekend slots available.",
        rating: 5,
        reviews: 40,
        location: "Faro",
        category: "Dog Walking",
        image: "/static/img/4.png",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Bruno",
        userReviews: [
            { name: "Marta G.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marta", rating: 5 },
            { name: "Pedro E.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pedro", rating: 5 },
            { name: "Filipa B.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Filipa", rating: 5 }
        ]
    },
    {
        name: "Clara Nunes",
        trade1: { title: "Plumbing", icon: "/static/img/5.png" },
        trade2: { title: "24/7 Availability", icon: "/static/img/6.png" },
        description: "Fast plumbing repairs and leak detection. Available 24/7.",
        rating: 5,
        reviews: 33,
        location: "Braga",
        category: "Plumbing",
        image: "/static/img/5.png",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Clara",
        userReviews: [
            { name: "Marta G.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marta", rating: 5 },
            { name: "Pedro E.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pedro", rating: 5 },
            { name: "Filipa B.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Filipa", rating: 5 }
        ]
    },
    {
        name: "João Freitas",
        trade1: { title: "Dairy Delivery", icon: "/static/img/6.png" },
        trade2: { title: "Farm Fresh", icon: "/static/img/5.png" },
        description: "Fresh milk, cheese, and yogurt delivered straight to your door.",
        rating: 4,
        reviews: 18,
        location: "Setúbal",
        category: "Dairy Delivery",
        image: "/static/img/6.png",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=João",
        userReviews: [
            { name: "Marta G.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marta", rating: 5 },
            { name: "Pedro E.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pedro", rating: 5 },
            { name: "Filipa B.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Filipa", rating: 5 }
        ]
    },
    {
        name: "Ana Teixeira",
        trade1: { title: "Painting Services", icon: "/static/img/7.png" },
        trade2: { title: "Free Quotes", icon: "/static/img/4.png" },
        description: "Interior and exterior painting with premium finishes. Free quotes.",
        rating: 4,
        reviews: 25,
        location: "Aveiro",
        category: "Painting Services",
        image: "/static/img/7.png",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ana",
        userReviews: [
            { name: "Marta G.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marta", rating: 5 },
            { name: "Pedro E.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pedro", rating: 5 },
            { name: "Filipa B.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Filipa", rating: 5 }
        ]
    },
    {
        name: "David Rocha",
        trade1: { title: "Finance Advice", icon: "/static/img/8.png" },
        trade2: { title: "Investment Tips", icon: "/static/img/3.png" },
        description: "Helping you manage savings and investments wisely and efficiently.",
        rating: 3,
        reviews: 13,
        location: "Évora",
        category: "Finance Advice",
        image: "/static/img/8.png",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=David",
        userReviews: [
            { name: "Marta G.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marta", rating: 5 },
            { name: "Pedro E.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pedro", rating: 5 },
            { name: "Filipa B.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Filipa", rating: 5 }
        ]
    },
    {
        name: "Sofia Pinto",
        trade1: { title: "Lawn Care", icon: "/static/img/9.png" },
        trade2: { title: "Eco Tools", icon: "/static/img/2.png" },
        description: "Garden and lawn maintenance with eco-friendly tools and great results.",
        rating: 5,
        reviews: 29,
        location: "Leiria",
        category: "Lawn Care",
        image: "/static/img/9.png",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sofia",
        userReviews: [
            { name: "Marta G.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marta", rating: 5 },
            { name: "Pedro E.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pedro", rating: 5 },
            { name: "Filipa B.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Filipa", rating: 5 }
        ]
    },
    {
        name: "Ricardo Lopes",
        trade1: { title: "Eco Plumbing", icon: "/static/img/10.png" },
        trade2: { title: "Water Saving", icon: "/static/img/1.png" },
        description: "Sustainable plumbing solutions focused on water-saving systems.",
        rating: 5,
        reviews: 31,
        location: "Viseu",
        category: "Eco Plumbing",
        image: "/static/img/10.png",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ricardo",
        userReviews: [
            { name: "Marta G.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marta", rating: 5 },
            { name: "Pedro E.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pedro", rating: 5 },
            { name: "Filipa B.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Filipa", rating: 5 }
        ]
    }
];


function renderFeed(data) {
    const feedContainer = document.getElementById("feed-container");
    feedContainer.innerHTML = "";

    data.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-left">
                <h3 class="category-h3">${item.category}</h3>
                <img src="${item.image}" alt="${item.category}" />
            </div>
            <div class="card-right">
                <h4>${item.name}</h4>
                <div class="stars">${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</div>
                <p>${item.description}</p>
                <button class="contact-btn">CONTACT 📩</button>
            </div>
        `;

        card.addEventListener("click", () => openProfileModal(item));

        card.querySelector(".contact-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            openProfileModal(item);
        });

        feedContainer.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    renderFeed(feedData);
});

function openProfileModal(profile) {
    window.selectedUser = profile;

    document.getElementById("profile-avatar").src = profile.avatar;
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-description").textContent = profile.description;

    const ratingContainer = document.getElementById("modal-user-rating");
    const rating = profile.rating || 5;
    ratingContainer.innerHTML = "★".repeat(rating) + "☆".repeat(5 - rating);

    const reviewsContainer = document.getElementById("tab-reviews");
    reviewsContainer.innerHTML = "";

    profile.userReviews.forEach((review) => {
        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("review-item");

        const avatarUrl = review.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(review.name)}`;
        const reviewRating = review.rating || 5;
        const stars = "★".repeat(reviewRating) + "☆".repeat(5 - reviewRating);

        reviewDiv.innerHTML = `
            <div class="review-content">
                <img class="review-avatar" src="${avatarUrl}" alt="${review.name}" />
                <div>
                    <strong>${review.name}</strong>
                    <div class="review-stars">${stars}</div>
                </div>
            </div>
        `;

        reviewsContainer.appendChild(reviewDiv);
    });

    document.getElementById("profile-feed-modal").style.display = "flex";
    showTab("tab-services");
}

function closeProfileModal() {
    document.getElementById("profile-feed-modal").style.display = "none";
}

function openContactModal() {
    const contactModal = document.getElementById("contact-modal");
    contactModal.style.display = "flex";
    closeProfileModal();

    const user = window.selectedUser;
    if (!user) return;

    document.getElementById("modal-user-avatar").src = user.avatar;
    document.getElementById("modal-user-name").textContent = user.name;
    document.getElementById("modal-user-rating").innerHTML = "★".repeat(user.rating) + "☆".repeat(5 - user.rating);

    document.getElementById("modal-trade1-icon").src = user.trade1.icon;
    document.getElementById("modal-trade1-title").textContent = user.trade1.title;

    document.getElementById("modal-user-description").textContent = user.description;
}

function closeModal() {
    const contactModal = document.getElementById("contact-modal");
    contactModal.style.display = "none";
}

function showTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabId).style.display = 'block';

    if (event) {
        event.currentTarget.classList.add('active');
    }
}
