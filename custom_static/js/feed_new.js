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
            { name: "Mariana S", comment: "Adorei o carrinho, super confortável e seguro para o meu bebé!" },
            { name: "João P", comment: "Excelente qualidade e entrega rápida. Recomendo!" },
            { name: "Mariana S", comment: "Adorei o carrinho, super confortável e seguro para o meu bebé!" },
            { name: "João P", comment: "Excelente qualidade e entrega rápida. Recomendo!" },
            { name: "Mariana S", comment: "Adorei o carrinho, super confortável e seguro para o meu bebé!" },
            { name: "João P", comment: "Excelente qualidade e entrega rápida. Recomendo!" },
            { name: "Mariana S", comment: "Adorei o carrinho, super confortável e seguro para o meu bebé!" },
            { name: "João P", comment: "Excelente qualidade e entrega rápida. Recomendo!" },
            { name: "Mariana S", comment: "Adorei o carrinho, super confortável e seguro para o meu bebé!" },
            { name: "João P", comment: "Excelente qualidade e entrega rápida. Recomendo!" },
            { name: "Mariana S", comment: "Adorei o carrinho, super confortável e seguro para o meu bebé!" },
            { name: "João P", comment: "Excelente qualidade e entrega rápida. Recomendo!" },
            { name: "Ana L", comment: "Produtos muito bons e atendimento impecável. Voltarei a comprar." }
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
            { name: "Sofia M.", comment: "Casa impecável! Serviço muito detalhado e eficiente." },
            { name: "Rui C.", comment: "Profissionalismo e pontualidade. Recomendo vivamente." },
            { name: "Beatriz A.", comment: "Ótimo trabalho, a casa ficou a brilhar. Preço justo." }
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
            { name: "Tiago D.", comment: "Conhecimento profundo de PCs retro. Conseguiu reparar o meu ZX Spectrum!" },
            { name: "Vanda R.", comment: "Peças difíceis de encontrar, mas ela tinha. Excelente!" },
            { name: "Nuno F.", comment: "Resolveu um problema que mais ninguém conseguia. Recomendo a quem tem máquinas antigas." }
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
            { name: "Marta G.", comment: "O meu cão adora o Bruno! Volta sempre feliz e cansado." },
            { name: "Pedro E.", comment: "Serviço super atencioso e confiável. Recomendo para quem tem cães." },
            { name: "Filipa B.", comment: "Muito profissional e carinhoso com os animais. Impecável!" }
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
            { name: "Vasco C.", comment: "Chegou super rápido e resolveu o problema em minutos. Excelente!" },
            { name: "Diana P.", comment: "Serviço de emergência impecável. Muito profissionalismo." },
            { name: "Hugo Q.", comment: "Reparação rápida e limpa. Recomendo a Clara para qualquer problema de canalização." }
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
            { name: "Carla H.", comment: "Produtos frescos e de ótima qualidade. Entrega sempre pontual." },
            { name: "Rui I.", comment: "Leite delicioso e iogurtes artesanais. Adoro o serviço!" },
            { name: "Eva J.", comment: "Conveniência e qualidade. Uma mais-valia para o dia a dia." }
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
            { name: "Luís K.", comment: "Pintura impecável, casa nova! Muito atenciosa e profissional." },
            { name: "Inês M.", comment: "Trabalho rápido e limpo. Recomendo os serviços da Ana." },
            { name: "Paulo N.", comment: "Acabamentos de alta qualidade. Gostei muito do resultado final." }
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
            { name: "Sandra O.", comment: "Conselhos muito úteis para as minhas poupanças. Ajudou-me muito." },
            { name: "Ricardo P.", comment: "Esclarecedor e prático. As dicas de investimento foram valiosas." },
            { name: "Daniela Q.", comment: "Profissional competente e direto. Recomendo para quem precisa de orientação financeira." }
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
            { name: "Fernando R.", comment: "Jardim impecável e com um aspeto saudável. Usa produtos amigos do ambiente." },
            { name: "Leonor S.", comment: "Excelente serviço de jardinagem. A relva nunca esteve tão verde!" },
            { name: "Miguel T.", comment: "Rápida e eficiente, o jardim ficou um espetáculo. Recomendo!" }
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
            { name: "Joana U.", comment: "Instalou um sistema de poupança de água que é excelente. Muito consciente." },
            { name: "Diogo V.", comment: "Canalizador ecológico e muito competente. Recomendo os seus serviços." },
            { name: "Patrícia W.", comment: "Soluções sustentáveis e eficazes. Estou muito satisfeita." }
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

function openProfileModal(user) {
    document.getElementById("profile-avatar").src = user.avatar;
    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-description").textContent = user.description;

    window.selectedUser = user;
    document.getElementById("profile-feed-modal").classList.add("active");

    document.getElementById("tab-services").innerHTML = `
        <img src="${user.trade1.icon}" alt="${user.trade1.title}" />
        <p>${user.trade1.title}</p>
    `;

    document.getElementById("tab-needed").innerHTML = `
        <p>Precisa de ajuda com jardinagem e pequenas manutenções.</p>
    `;

    const reviewHTML = user.userReviews.map(r => `<div class="review"><strong>${r.name}:</strong> ${r.comment}</div>`).join("");

    document.getElementById("tab-reviews").innerHTML = reviewHTML;
}


function closeProfileModal() {
    document.getElementById("profile-feed-modal").classList.remove("active");
}

function openContactModal() {
    closeProfileModal();

    const user = window.selectedUser;
    if (!user) return;

    document.getElementById("modal-user-avatar").src = user.avatar;
    document.getElementById("modal-user-name").textContent = user.name;
    document.getElementById("modal-user-rating").innerHTML =
        "★".repeat(user.rating) + "☆".repeat(5 - user.rating);

    document.getElementById("modal-trade1-icon").src = user.trade1.icon;
    document.getElementById("modal-trade1-title").textContent = user.trade1.title;

    document.getElementById("modal-user-description").textContent = user.description;

    document.getElementById("contact-modal").classList.add("active");
}

function closeModal() {
    document.getElementById("contact-modal").classList.remove("active");
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabId).style.display = 'block';
    event.currentTarget.classList.add('active');
}