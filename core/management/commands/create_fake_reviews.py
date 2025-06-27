# your_app_name/management/commands/create_test_reviews.py

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Review, ServiceRequest
import random
from django.utils import timezone # Added for timestamping reviews if needed, though default auto_now_add is fine

class Command(BaseCommand):
    help = 'Create test reviews between users who have completed service requests.'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        users = list(User.objects.all())

        if len(users) < 2:
            self.stdout.write(self.style.ERROR("Need at least two users to create reviews. Please create more users."))
            return

        self.stdout.write(self.style.HTTP_INFO("\nCreating test reviews..."))

        # Get all completed service requests
        completed_requests = ServiceRequest.objects.filter(status='completed')
        
        # Check if there are any completed requests
        if not completed_requests.exists():
            self.stdout.write(self.style.WARNING("No completed service requests found. Cannot create reviews."))
            self.stdout.write(self.style.WARNING("Please ensure you have run 'create_test_service_requests' and that it created 'completed' requests."))
            return

        reviews_created_count = 0
        for request in completed_requests:
            reviewer = request.sender # The one who requested the service can review the provider
            reviewee = request.receiver # The one who provided the service gets reviewed

            # Ensure we don't review ourselves
            if reviewer == reviewee:
                self.stdout.write(self.style.WARNING(f"Skipping self-review for request {request.id} ({reviewer.username} reviewing themselves)."))
                continue

            # Check if a review for this *specific service request* already exists
            existing_review_for_request = Review.objects.filter(
                service_request=request # Now checking against the specific request
            ).exists()

            if existing_review_for_request:
                self.stdout.write(self.style.WARNING(f"Review for request {request.id} already exists. Skipping."))
                continue

            rating = random.randint(1, 5) # Ratings from 1 to 5 as requested

            try:
                review = Review.objects.create(
                    user=reviewer,
                    reviewee=reviewee,
                    rating=rating,
                    service_request=request # Assign the service request to the review
                )
                reviews_created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created review ({reviews_created_count}): '{review.user.username}' rated '{review.reviewee.username}' {review.rating} stars for request {request.id}."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error creating review for request {request.id} from {reviewer.username} to {reviewee.username}: {e}"))
        
        if reviews_created_count == 0:
            self.stdout.write(self.style.WARNING("No new reviews were created. This might be because all eligible completed requests already have reviews."))
        self.stdout.write(self.style.SUCCESS(f"\nFinished creating test reviews. Total new reviews created: {reviews_created_count}."))