const feedData = [
    {
        name: "Laura Silva",
        category: "Baby Products",
        description: "High-quality strollers and baby accessories. Comfort and safety first.",
        rating: 5,
        reviews: 36,
        location: "Lisbon",
        image: "../img/1.png"
    },
    {
        name: "Miguel Costa",
        category: "Cleaning Services",
        description: "Professional home and office cleaning. Flexible hours and reliable results.",
        rating: 4,
        reviews: 22,
        location: "Porto",
        image: "../img/2.png"
    },
    {
        name: "Sara Marques",
        category: "Computer Repair",
        description: "Retro PC repairs and parts for classic models. Perfect for collectors.",
        rating: 3,
        reviews: 14,
        location: "Coimbra",
        image: "../img/3.png"
    },
    {
        name: "Bruno Almeida",
        category: "Dog Walking",
        description: "Friendly and caring dog walking service. Daily and weekend slots available.",
        rating: 5,
        reviews: 40,
        location: "Faro",
        image: "../img/4.png"
    },
    {
        name: "Clara Nunes",
        category: "Plumbing",
        description: "Fast plumbing repairs and leak detection. Available 24/7.",
        rating: 5,
        reviews: 33,
        location: "Braga",
        image: "../img/5.png"
    },
    {
        name: "João Freitas",
        category: "Dairy Delivery",
        description: "Fresh milk, cheese, and yogurt delivered straight to your door.",
        rating: 4,
        reviews: 18,
        location: "Setúbal",
        image: "../img/6.png"
    },
    {
        name: "Ana Teixeira",
        category: "Painting Services",
        description: "Interior and exterior painting with premium finishes. Free quotes.",
        rating: 4,
        reviews: 25,
        location: "Aveiro",
        image: "../img/7.png"
    },
    {
        name: "David Rocha",
        category: "Finance Advice",
        description: "Helping you manage savings and investments wisely and efficiently.",
        rating: 3,
        reviews: 13,
        location: "Évora",
        image: "../img/8.png"
    },
    {
        name: "Sofia Pinto",
        category: "Lawn Care",
        description: "Garden and lawn maintenance with eco-friendly tools and great results.",
        rating: 5,
        reviews: 29,
        location: "Leiria",
        image: "../img/9.png"
    },
    {
        name: "Ricardo Lopes",
        category: "Eco Plumbing",
        description: "Sustainable plumbing solutions focused on water-saving systems.",
        rating: 5,
        reviews: 31,
        location: "Viseu",
        image: "../img/10.png"
    }
];

function renderFeed(data) {
    const feedContainer = document.getElementById("feed-container");
    feedContainer.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        const stars = "★".repeat(item.rating) + "☆".repeat(5 - item.rating);

        card.innerHTML = `
        <div class="card-left">
            <h3 class="category-h3">${item.category}</h3>
            <img src="${item.image}" alt="${item.category}" />
        </div>
        <div class="card-right">
            <h4>${item.name}</h4>
            <div class="stars">
            ${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}
            </div>
            <p>${item.description}</p>
            <button class="contact-btn">CONTACT 📩</button>
        </div>
        `;


        feedContainer.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    renderFeed(feedData);
});
