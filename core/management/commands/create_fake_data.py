from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Service # Assuming Service model is in core app
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Create test users and services for Bartrify chat with random avatars and bios.'

    def handle(self, *args, **kwargs):
        # --- Avatar URLs ---
        # A list of diverse placeholder avatar URLs.
        # These are from pravatar.cc, offering a good variety.
        avatar_urls = [
            "https://i.pravatar.cc/150?img=1",
            "https://i.pravatar.cc/150?img=2",
            "https://i.pravatar.cc/150?img=3",
            "https://i.pravatar.cc/150?img=4",
            "https://i.pravatar.cc/150?img=5",
            "https://i.pravatar.cc/150?img=6",
            "https://i.pravatar.cc/150?img=7",
            "https://i.pravatar.cc/150?img=8",
            "https://i.pravatar.cc/150?img=9",
            "https://i.pravatar.cc/150?img=10",
            "https://i.pravatar.cc/150?img=11",
            "https://i.pravatar.cc/150?img=12",
            "https://i.pravatar.cc/150?img=13",
            "https://i.pravatar.cc/150?img=14",
            "https://i.pravatar.cc/150?img=15",
            "https://i.pravatar.cc/150?img=16",
            "https://i.pravatar.cc/150?img=17",
            "https://i.pravatar.cc/150?img=18",
            "https://i.pravatar.cc/150?img=19",
            "https://i.pravatar.cc/150?img=20",
        ]

        # --- Random Bio Sentences ---
        # A collection of simple sentences to form varied bios.
        bio_sentences = [
            "Passionate about creating and collaborating.",
            "Always learning and exploring new ideas.",
            "Dedicated to crafting quality solutions.",
            "Loves problem-solving and innovative thinking.",
            "Enthusiastic about technology and design.",
            "Friendly and open to new connections.",
            "Creative mind with a knack for details.",
            "Seeking exciting new challenges.",
            "Inspired by community and shared knowledge.",
            "Bringing ideas to life with a positive attitude.",
            "Detail-oriented and results-driven.",
            "Curious learner with a wide range of interests.",
            "Always striving for excellence.",
            "Enjoying the journey of continuous improvement.",
            "Building connections one conversation at a time."
        ]

        # Sample users data (you can keep this as is or expand)
        users_template_data = [
            {'username': 'userA', 'email': 'a@example.com', 'password': 'testpass123', 'first_name': 'John', 'last_name': 'Doe', 'location': 'Faro'},
            {'username': 'userB', 'email': 'b@example.com', 'password': 'testpass123', 'first_name': 'Jane', 'last_name': 'Smith', 'location': 'Lisboa'},
            {'username': 'userC', 'email': 'c@example.com', 'password': 'testpass123', 'first_name': 'Jake', 'last_name': 'Johnson', 'location': 'Porto'},
            {'username': 'userD', 'email': 'd@example.com', 'password': 'testpass123', 'first_name': 'Anna', 'last_name': 'Williams', 'location': 'Albufeira'},
            {'username': 'userE', 'email': 'e@example.com', 'password': 'testpass123', 'first_name': 'Mike', 'last_name': 'Brown', 'location': 'Coimbra'},
            {'username': 'userF', 'email': 'f@example.com', 'password': 'testpass123', 'first_name': 'Sara', 'last_name': 'Garcia', 'location': 'Braga'},
        ]
        
        # --- Create Users with Random Avatars and Bios ---
        self.stdout.write(self.style.HTTP_INFO("Creating test users..."))
        for u_data in users_template_data:
            if not get_user_model().objects.filter(username=u_data['username']).exists():
                # Get a random avatar URL
                random_avatar = random.choice(avatar_urls)
                
                # Construct a random bio using a few sentences
                num_sentences = random.randint(1, 3) # Bio with 1 to 3 sentences
                random_bio_parts = random.sample(bio_sentences, min(num_sentences, len(bio_sentences)))
                random_bio = " ".join(random_bio_parts)
                
                user = get_user_model().objects.create_user(
                    username=u_data['username'], 
                    email=u_data['email'], 
                    password=u_data['password'],
                    first_name=u_data['first_name'],
                    last_name=u_data['last_name'],
                    bio=random_bio,      # Assign the random bio
                    location=u_data['location'],
                    avatar=random_avatar, # Assign the random avatar
                )
                self.stdout.write(self.style.SUCCESS(f"Created user: {u_data['username']} (Bio: '{random_bio[:30]}...', Avatar: {random_avatar})"))
            else:
                self.stdout.write(self.style.WARNING(f"User {u_data['username']} already exists. Skipping user creation."))
        
        # --- Categories for Services ---
        categories = [
            'IT_SUPPORT', 'GRAPHIC_DESIGN', 'WEB_DEV', 'LANG_TUTOR', 'HOME_REPAIR', 'CLEANING',
            'PET_SITTING', 'PHOTOGRAPHY', 'CONSULTING', 'FITNESS_COACH', 'EDUCATION', 'HANDICRAFTS'
        ]

        # Get all existing users to assign services
        users = get_user_model().objects.all()

        if not users.exists():
            self.stdout.write(self.style.ERROR("No users found to assign services to. Please ensure users are created."))
            return # Exit if no users are available

        # --- Create Services ---
        self.stdout.write(self.style.HTTP_INFO("\nCreating test services..."))
        for i in range(15): # Create 15 services
            owner = users[i % len(users)] # Cycle through created users

            category = categories[i % len(categories)] # Cycle through categories
            desired_category = categories[(i + 1) % len(categories)] # A different desired category

            # Ensure the desired_category is not the same as the main category, if possible
            if desired_category == category and len(categories) > 1:
                # If they are the same, pick another random one that's different
                other_categories = [c for c in categories if c != category]
                if other_categories:
                    desired_category = random.choice(other_categories)

            # Assign a fixed price for simplicity as per your original request
            service_price = Decimal(100.00) 

            # Only create if it doesn't already exist to prevent duplicates on subsequent runs
            service, created = Service.objects.get_or_create(
                owner=owner,
                title=f"Service {i+1} by {owner.username}",
                defaults={ # These fields are only set if a new object is created
                    "description": f"This is a comprehensive description for Service {i+1}. It provides expert assistance in {category.replace('_', ' ')}. The owner, {owner.first_name}, is looking to barter for services in {desired_category.replace('_', ' ')}.",
                    "category": category,
                    "desired_category": desired_category,
                    "price": service_price,
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"Created service: '{service.title}' (Category: {service.category}, Desired: {service.desired_category})"))
            else:
                self.stdout.write(self.style.WARNING(f"Service '{service.title}' already exists. Skipping service creation."))

        self.stdout.write(self.style.SUCCESS("\nAll test users and services setup complete!"))