from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from core.models import Review, User
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

class SubmitReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("user_id")
        if not user_id:
            user_id = request.user.id

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({'error': 'Invalid user_id'}, status=400)

        reviews = Review.objects.filter(reviewee_id=user_id)

        data = [
            {
                'id': review.id,
                'user_id': review.user.id,
                'username': review.user.username,
                'rating': review.rating,
                'created_at': review.created_at.isoformat(),
            }
            for review in reviews
        ]

        return Response(data)

    def post(self, request, *args, **kwargs):
        data = request.data
        user = request.user

        try:
            reviewee_user_id = int(data.get("reviewee_user_id"))
            rating = int(data.get("rating"))
        except (TypeError, ValueError):
            return Response({'error': 'Invalid data. Rating and user ID must be integers.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate rating range
        if rating < 1 or rating > 5:
            return Response({'error': 'Rating must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent reviewing self
        if reviewee_user_id == user.id:
            return Response({'error': 'You cannot review yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate reviewee exists
        reviewee_user = get_object_or_404(User, id=reviewee_user_id)

        # Prevent duplicate review for the same reviewee by this user
        if Review.objects.filter(user=user, reviewee=reviewee_user).exists():
            return Response({'error': 'You have already reviewed this user.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the review
        Review.objects.create(user=user, reviewee=reviewee_user, rating=rating)

        return Response({'message': 'Review submitted successfully!'}, status=status.HTTP_201_CREATED)
    
    
class CheckReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        reviewer = request.user
        reviewee_id = request.query_params.get("reviewee_user_id")

        if not reviewee_id:
            return Response({'error': 'Missing reviewee_user_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reviewee_id = int(reviewee_id)
        except ValueError:
            return Response({'error': 'Invalid reviewee_user_id'}, status=status.HTTP_400_BAD_REQUEST)

        if reviewee_id == reviewer.id:
            return Response({'error': 'Cannot check review for yourself'}, status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.filter(user=reviewer, reviewee__id=reviewee_id).first()

        if review:
            return Response({'reviewed': True, 'rating': review.rating})
        else:
            return Response({'reviewed': False})

class UserReceivedReviewsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Optional: fetch another user's reviews by ?user_id=
        user_id = request.query_params.get("user_id")
        if user_id:
            try:
                user_id = int(user_id)
            except ValueError:
                return Response({"error": "Invalid user_id"}, status=400)
        else:
            user_id = request.user.id

        reviews = Review.objects.filter(reviewee_id=user_id)

        data = [
            {
                'id': review.id,
                'user_id': review.user.id,  # reviewer ID
                'username': review.user.username,  # reviewer name
                'rating': review.rating,
                'created_at': review.created_at.isoformat(),
            }
            for review in reviews
        ]

        return Response(data)
