from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from core.models import Review, User, ServiceRequest

class SubmitReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data
        user = request.user

        try:
            reviewee_user_id = int(data.get("reviewee_user_id"))
            rating = int(data.get("rating"))
            service_request_id = data.get("service_request")  # ✅ FIXED: get from body
        except (TypeError, ValueError):
            return Response({'error': 'Invalid data. Rating, user ID and request ID must be integers.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if rating < 1 or rating > 5:
            return Response({'error': 'Rating must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)

        if reviewee_user_id == user.id:
            return Response({'error': 'You cannot review yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        reviewee_user = get_object_or_404(User, id=reviewee_user_id)
        service_request = get_object_or_404(ServiceRequest, id=service_request_id)

        if user != service_request.sender and user != service_request.receiver:
            return Response({'error': 'You are not part of this exchange.'}, status=status.HTTP_403_FORBIDDEN)
        if Review.objects.filter(user=user, service_request=service_request).exists():
            return Response({'error': 'You have already reviewed this request.'}, status=status.HTTP_400_BAD_REQUEST)

        Review.objects.create(
            user=user,
            reviewee=reviewee_user,
            rating=rating,
            service_request=service_request
        )

        return Response({'message': 'Review submitted successfully!'}, status=status.HTTP_201_CREATED)
    
    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("user_id") or request.user.id
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

        
    
class CheckReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        reviewer = request.user
        reviewee_id = request.query_params.get("reviewee_user_id")
        service_request_id = request.query_params.get("service_request")

        if not reviewee_id or not service_request_id:
            return Response({'error': 'Missing reviewee_user_id or service_request'}, status=400)

        try:
            reviewee_id = int(reviewee_id)
            service_request_id = int(service_request_id)
        except (TypeError, ValueError):
            return Response({'error': 'Invalid reviewee_user_id or service_request'}, status=400)

        if reviewee_id == reviewer.id:
            return Response({'error': 'Cannot check review for yourself'}, status=400)

        review = Review.objects.filter(
            user=reviewer,
            reviewee_id=reviewee_id,
            service_request_id=service_request_id
        ).first()

        if review:
            return Response({'reviewed': True, 'rating': review.rating})
        else:
            return Response({'reviewed': False})


class UserReceivedReviewsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
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
