from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Service 
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Create test users and services for Bartrify with random avatars, bios, and specific quantity.'

    def handle(self, *args, **kwargs):
        User = get_user_model()

        # --- Avatar URLs ---
        avatar_urls = [
            "https://i.pravatar.cc/150?img=1", "https://i.pravatar.cc/150?img=2", "https://i.pravatar.cc/150?img=3",
            "https://i.pravatar.cc/150?img=4", "https://i.pravatar.cc/150?img=5", "https://i.pravatar.cc/150?img=6",
            "https://i.pravatar.cc/150?img=7", "https://i.pravatar.cc/150?img=8", "https://i.pravatar.cc/150?img=9",
            "https://i.pravatar.cc/150?img=10", "https://i.pravatar.cc/150?img=11", "https://i.pravatar.cc/150?img=12",
            "https://i.pravatar.cc/150?img=13", "https://i.pravatar.cc/150?img=14", "https://i.pravatar.cc/150?img=15",
            "https://i.pravatar.cc/150?img=16", "https://i.pravatar.cc/150?img=17", "https://i.pravatar.cc/150?img=18",
            "https://i.pravatar.cc/150?img=19", "https://i.pravatar.cc/150?img=20", "https://i.pravatar.cc/150?img=21",
            "https://i.pravatar.cc/150?img=22", "https://i.pravatar.cc/150?img=23", "https://i.pravatar.cc/150?img=24",
            "https://i.pravatar.cc/150?img=25", "https://i.pravatar.cc/150?img=26", "https://i.pravatar.cc/150?img=27",
            "https://i.pravatar.cc/150?img=28", "https://i.pravatar.cc/150?img=29", "https://i.pravatar.cc/150?img=30",
        ]

        # --- Random Bio Sentences ---
        bio_sentences = [
            "Passionate about creating and collaborating.", "Always learning and exploring new ideas.",
            "Dedicated to crafting quality solutions.", "Loves problem-solving and innovative thinking.",
            "Enthusiastic about technology and design.", "Friendly and open to new connections.",
            "Creative mind with a knack for details.", "Seeking exciting new challenges.",
            "Inspired by community and shared knowledge.", "Bringing ideas to life with a positive attitude.",
            "Detail-oriented and results-driven.", "Curious learner with a wide range of interests.",
            "Always striving for excellence.", "Enjoying the journey of continuous improvement.",
            "Building connections one conversation at a time.", "A wizard with code and a lover of nature.",
            "Helping local businesses thrive with digital solutions.", "Sharing my passion for sustainable living.",
            "Crafting beautiful and functional web experiences.", "Your go-to for quick and effective tech fixes.",
            "Transforming spaces with a touch of magic and expertise.", "Connecting people through shared skills."
        ]

        # --- Expanded User Template Data (at least 20 users) ---
        users_template_data = [
            {'first_name': 'João', 'last_name': 'Silva', 'location': 'Lisboa'},
            {'first_name': 'Maria', 'last_name': 'Santos', 'location': 'Porto'},
            {'first_name': 'Pedro', 'last_name': 'Pereira', 'location': 'Faro'},
            {'first_name': 'Ana', 'last_name': 'Martins', 'location': 'Coimbra'},
            {'first_name': 'Carlos', 'last_name': 'Oliveira', 'location': 'Braga'},
            {'first_name': 'Sofia', 'last_name': 'Costa', 'location': 'Cascais'},
            {'first_name': 'Miguel', 'last_name': 'Almeida', 'location': 'Aveiro'},
            {'first_name': 'Teresa', 'last_name': 'Rodrigues', 'location': 'Évora'},
            {'first_name': 'Ricardo', 'last_name': 'Fernandes', 'location': 'Setúbal'},
            {'first_name': 'Inês', 'last_name': 'Gomes', 'location': 'Guimarães'},
            {'first_name': 'Diogo', 'last_name': 'Lopes', 'location': 'Viseu'},
            {'first_name': 'Marta', 'last_name': 'Ribeiro', 'location': 'Leiria'},
            {'first_name': 'Bruno', 'last_name': 'Carvalho', 'location': 'Santarém'},
            {'first_name': 'Laura', 'last_name': 'Jesus', 'location': 'Portimão'},
            {'first_name': 'Vasco', 'last_name': 'Freitas', 'location': 'Bragança'},
            {'first_name': 'Catarina', 'last_name': 'Sousa', 'location': 'Beja'},
            {'first_name': 'André', 'last_name': 'Pinto', 'location': 'Viana do Castelo'},
            {'first_name': 'Daniela', 'last_name': 'Rocha', 'location': 'Funchal'},
            {'first_name': 'Gonçalo', 'last_name': 'Correia', 'location': 'Ponta Delgada'},
            {'first_name': 'Mariana', 'last_name': 'Monteiro', 'location': 'Guarda'},
            {'first_name': 'Nuno', 'last_name': 'Pires', 'location': 'Castelo Branco'},
            {'first_name': 'Beatriz', 'last_name': 'Neves', 'location': 'Vila Real'},
            {'first_name': 'Hugo', 'last_name': 'Ramos', 'location': 'Tomar'},
            {'first_name': 'Filipa', 'last_name': 'Silva', 'location': 'Figueira da Foz'},
        ]

        self.stdout.write(self.style.HTTP_INFO("Creating test users..."))
        for u_data in users_template_data:
            username = f"{u_data['first_name'].lower()}.{u_data['last_name'].lower()}"
            email = f"{username}@example.com"
            password = 'testpass123'

            if not User.objects.filter(username=username).exists():
                random_avatar = random.choice(avatar_urls)
                num_sentences = random.randint(1, 3)
                random_bio_parts = random.sample(bio_sentences, min(num_sentences, len(bio_sentences)))
                random_bio = " ".join(random_bio_parts)

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=u_data['first_name'],
                    last_name=u_data['last_name'],
                    bio=random_bio,
                    location=u_data['location'],
                    avatar_url=random_avatar,
                )
                self.stdout.write(self.style.SUCCESS(f"Created user: {username} (Bio: '{random_bio[:30]}...', Avatar: {random_avatar})"))
            else:
                self.stdout.write(self.style.WARNING(f"User {username} already exists. Skipping user creation."))

        categories = [choice[0] for choice in Service.CATEGORY_CHOICES]

        # --- Realistic Service Titles & Descriptions ---
        service_titles = {
            'IT_SUPPORT': ["Laptop Troubleshooting", "Network Setup & Repair", "Software Installation Help", "Virus Removal Service", "Basic Computer Maintenance"],
            'GRAPHIC_DESIGN': ["Logo Design", "Brochure & Flyer Design", "Social Media Graphics", "Brand Identity Package", "Custom Illustration"],
            'WEB_DEV': ["Simple Landing Page Creation", "WordPress Site Setup", "E-commerce Website Consultation", "Front-End Development Help", "Website Bug Fixing"],
            'LANG_TUTOR': ["English Conversation Practice", "Portuguese Language Basics", "Spanish Grammar Help", "French Accent Coaching", "German for Beginners"],
            'HOME_REPAIR': ["Minor Plumbing Fixes", "Light Fixture Installation", "Shelf Mounting", "Furniture Assembly", "Small Painting Jobs"],
            'CLEANING': ["Apartment Deep Cleaning", "Weekly Home Tidying", "Office Space Cleaning", "Window Washing", "Post-Event Cleanup"],
            'PET_SITTING': ["Dog Walking Service", "Cat Feeding & Playtime", "Overnight Pet Care", "Pet Grooming Basic", "Fish Tank Maintenance"],
            'PHOTOGRAPHY': ["Portrait Photography Session", "Event Photography (Small)", "Product Photography", "Photo Editing & Retouching", "Landscape Photography Tips"],
            'CONSULTING': ["Startup Business Advice", "Marketing Strategy Session", "Career Coaching", "Financial Planning Overview", "Project Management Consulting"],
            'FITNESS_COACH': ["Personalized Workout Plan", "Nutrition Guidance", "Yoga & Stretching Session", "Running Coaching", "Strength Training Basics"],
            'EDUCATION': ["Math Tutoring (High School)", "Science Project Help", "History Essay Review", "Exam Prep Coaching", "Study Skills Development"],
            'HANDICRAFTS': ["Custom Jewelry Making", "Knitted Scarf Creation", "Handmade Card Design", "Pottery Class (Beginner)", "Personalized Gift Crafting"],
        }

        service_descriptions = {
            'IT_SUPPORT': "Expert help with your computer issues, from slow performance to software glitches. Get your tech running smoothly again.",
            'GRAPHIC_DESIGN': "Creating eye-catching visuals for your brand or personal projects. Logos, flyers, and digital art.",
            'WEB_DEV': "Building modern and responsive websites. Specializing in user-friendly designs and quick deployment.",
            'LANG_TUTOR': "Improve your language skills with personalized tutoring. Focus on conversation, grammar, or exam preparation.",
            'HOME_REPAIR': "Reliable assistance for those nagging household repairs. No job too small, I'll get it done right.",
            'CLEANING': "Thorough and efficient cleaning services for homes and offices. Enjoy a spotless space without the hassle.",
            'PET_SITTING': "Caring and loving attention for your pets while you're away. Walks, feeding, and plenty of playtime.",
            'PHOTOGRAPHY': "Capturing your special moments or creating stunning visuals for your products. Professional quality, personalized service.",
            'CONSULTING': "Strategic advice to help your business or career grow. Unlock your potential with tailored guidance.",
            'FITNESS_COACH': "Achieve your fitness goals with custom workout plans and motivational support. Get healthier, stronger, happier.",
            'EDUCATION': "Support for students of all ages. From homework help to test preparation, I'm here to clarify concepts.",
            'HANDICRAFTS': "Unique, handmade items crafted with care and creativity. Perfect for gifts or personal treasures.",
        }

        users = User.objects.all()

        if not users.exists():
            self.stdout.write(self.style.ERROR("No users found to assign services to. Please ensure users are created."))
            return

        self.stdout.write(self.style.HTTP_INFO("\nCreating test services (at least 5 per user)..."))

        all_users = list(users)
        min_services_per_user = 5

        user_service_counts = {user.pk: 0 for user in all_users}


        total_services_target = len(all_users) * min_services_per_user
        current_services_count = 0
        max_attempts = total_services_target * 2 

        attempt = 0
        while current_services_count < total_services_target and attempt < max_attempts:
            owner = random.choice(all_users) 

            category_key = random.choice(categories)
            available_titles = service_titles.get(category_key, ["General Service"])
            
        
            title_suffix = 1
            base_title = random.choice(available_titles)
            service_title_full = f"{base_title} by {owner.first_name}"
            
    
            while Service.objects.filter(owner=owner, title=service_title_full).exists():
                title_suffix += 1
                service_title_full = f"{base_title} by {owner.first_name} ({title_suffix})"
                if title_suffix > 10: 
                    break 

            if Service.objects.filter(owner=owner, title=service_title_full).exists():
                attempt += 1
                continue

            desired_category_key = random.choice([c for c in categories if c != category_key] or categories)
            category_descriptions = service_descriptions.get(category_key)
            if category_descriptions:
                chosen_description = category_descriptions
            else:
                chosen_description = "A versatile service provided with care and quality."

            # Confirm full string is being used
            if not isinstance(chosen_description, str) or len(chosen_description) < 10:
                self.stdout.write(self.style.WARNING(
                    f"Suspiciously short description for category '{category_key}': {repr(chosen_description)}"
                ))

            service, created = Service.objects.get_or_create(
                owner=owner,
                title=service_title_full,
                defaults={
                    "description": chosen_description,
                    "category": category_key,
                    "desired_category": desired_category_key,
                    "price": Decimal('0.00'),
                    "trade_type": 'Barter',
                }
            )

            if created:
                user_service_counts[owner.pk] += 1
                current_services_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created service: '{service.title}' (Owner: {owner.username}, Cat: {service.category}, Desired: {service.desired_category}, Type: {service.trade_type})"))
            else:
                self.stdout.write(self.style.WARNING(f"Service '{service.title}' already exists. Skipping service creation for this entry."))
            
            attempt += 1 

        self.stdout.write(self.style.SUCCESS("\nAll test users and services setup complete!"))