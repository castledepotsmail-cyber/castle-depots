from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Promotes a user to superuser and staff status'

    def handle(self, *args, **options):
        User = get_user_model()
        email = 'castledepotsmail@gmail.com'
        username = 'castledepotsmail@gmail.com'
        
        try:
            user, created = User.objects.get_or_create(username=username, defaults={'email': email})
            
            if created:
                user.set_password('admin123') # Set a default password if created
                self.stdout.write(self.style.SUCCESS(f'User {username} created.'))
            
            user.is_superuser = True
            user.is_staff = True
            user.save()
            
            self.stdout.write(self.style.SUCCESS(f'Successfully promoted {username} to superuser and staff.'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
