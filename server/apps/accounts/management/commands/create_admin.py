from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Creates a default admin user if it does not exist'

    def handle(self, *args, **options):
        User = get_user_model()
        username = 'adminC_D'
        email = 'admin@castledepots.co.ke'
        password = 'C_D123admin'
        
        try:
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                self.stdout.write(self.style.WARNING(f'User {username} already exists.'))
                # Update to ensure they are superuser and staff
                user = User.objects.get(username=username)
                user.is_superuser = True
                user.is_staff = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Updated {username} to superuser and staff.'))
            else:
                # Create new superuser
                user = User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password
                )
                self.stdout.write(self.style.SUCCESS(f'Successfully created superuser {username}.'))
            
            # Also promote castledepotsmail@gmail.com if it exists
            castle_email = 'castledepotsmail@gmail.com'
            if User.objects.filter(email=castle_email).exists():
                castle_user = User.objects.get(email=castle_email)
                castle_user.is_superuser = True
                castle_user.is_staff = True
                castle_user.save()
                self.stdout.write(self.style.SUCCESS(f'Also promoted {castle_email} to superuser and staff.'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
