# your_app_name/management/commands/create_test_service_requests.py

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Service, ServiceRequest # Assuming your models are in core
import random
from django.utils import timezone

class Command(BaseCommand):
    help = 'Create test service requests, including some completed ones for reviews.'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        users = list(User.objects.all())
        services = list(Service.objects.all())

        if len(users) < 2:
            self.stdout.write(self.style.ERROR("Need at least two users to create service requests."))
            return
        if not services:
            self.stdout.write(self.style.ERROR("No services found. Please run 'create_test_users_services' first."))
            return

        self.stdout.write(self.style.HTTP_INFO("\nCreating test service requests..."))

        request_messages = [
            "Hi, I'm interested in your {service_title}. Would you be open to a barter for {desired_category}?",
            "I saw your service '{service_title}' and I'm keen to exchange. My skills are in {desired_category}.",
            "Could you tell me more about {service_title}? I'm looking for someone to help with {desired_category}.",
            "Looking to trade for your {service_title}. I offer help with {desired_category}.",
            "I'd love to request your {service_title} service. What kind of {desired_category} tasks are you looking for?",
            "Your {service_title} caught my eye! I can provide assistance with {desired_category}.",
            "Would you consider exchanging your {service_title} for some {desired_category} work?",
            "Hello, I need assistance with {service_category}. Your service {service_title} seems perfect. I can offer {desired_category} in return."
        ]

        # Define how many requests to create
        num_requests_to_create = 50 # Adjust as needed for more reviews

        requests_created_count = 0
        for i in range(num_requests_to_create):
            # Pick a random sender and receiver (must be different users)
            sender = random.choice(users)
            
            # Find services that are not owned by the sender
            available_services = [s for s in services if s.owner != sender]
            
            if not available_services:
                self.stdout.write(self.style.WARNING(f"No services found for {sender.username} to request. Skipping request creation for this user."))
                continue
            
            service_to_request = random.choice(available_services)
            receiver = service_to_request.owner

            # Ensure sender and receiver are distinct (already handled by filtering services)
            if sender == receiver: # This check is redundant with above logic but harmless
                continue

            # Randomly determine status
            status_choices = ['pending', 'in-progress', 'completed']
            # Make sure a good portion are 'completed' so reviews can be made (e.g., 50% chance of completed)
            chosen_status = random.choices(status_choices, weights=[0.2, 0.3, 0.5], k=1)[0]

            message_template = random.choice(request_messages)
            # Use get_category_display methods for human-readable output
            message_text = message_template.format(
                service_title=service_to_request.title,
                service_category=service_to_request.get_category_display(),
                desired_category=service_to_request.get_desired_category_display()
            )
            
            # Check if this exact request already exists to avoid duplicates
            request_exists = ServiceRequest.objects.filter(
                sender=sender,
                receiver=receiver,
                service=service_to_request,
                message=message_text # Add message to check for uniqueness
            ).exists()

            if request_exists:
                self.stdout.write(self.style.WARNING(f"Request for '{service_to_request.title}' from {sender.username} to {receiver.username} with this message already exists. Skipping."))
                continue

            request = ServiceRequest.objects.create(
                sender=sender,
                receiver=receiver,
                service=service_to_request,
                status=chosen_status,
                message=message_text,
                created_at=timezone.now() - timezone.timedelta(days=random.randint(0, 60)) # Requests from last 2 months
            )
            requests_created_count += 1
            self.stdout.write(self.style.SUCCESS(f"Created request ({requests_created_count}): '{request.service.title}' from {request.sender.username} to {request.receiver.username} (Status: {request.status})"))

        self.stdout.write(self.style.SUCCESS(f"\nFinished creating test service requests. Total new requests created: {requests_created_count}."))