from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create test users for Bartrify chat'

    def handle(self, *args, **kwargs):
        users = [
            {'username': 'userA', 'email': 'a@example.com', 'password': 'testpass123'},
            {'username': 'userB', 'email': 'b@example.com', 'password': 'testpass123'},
            {'username': 'userC', 'email': 'c@example.com', 'password': 'testpass123'},
            {'username': 'userD', 'email': 'd@example.com', 'password': 'testpass123'},
        ]

        for u in users:
            if not User.objects.filter(username=u['username']).exists():
                User.objects.create_user(username=u['username'], email=u['email'], password=u['password'])
                self.stdout.write(self.style.SUCCESS(f"Created {u['username']}"))

        self.stdout.write(self.style.SUCCESS("All test users created."))
