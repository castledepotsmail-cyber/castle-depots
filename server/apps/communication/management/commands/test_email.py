from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
import sys

class Command(BaseCommand):
    help = 'Test sending an email via the configured backend'

    def add_arguments(self, parser):
        parser.add_argument('to_email', type=str, help='Recipient email address')

    def handle(self, *args, **options):
        to_email = options['to_email']
        self.stdout.write(f"Attempting to send email to {to_email}...")
        self.stdout.write(f"Using backend: {settings.EMAIL_BACKEND}")
        self.stdout.write(f"Next.js API URL: {getattr(settings, 'NEXTJS_API_URL', 'Not Set')}")

        try:
            send_mail(
                subject='Test Email from Castle Depots',
                message='This is a test email sent from the Django management command to verify the Nodemailer integration.',
                from_email=None, # Uses DEFAULT_FROM_EMAIL
                recipient_list=[to_email],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS('Successfully sent email!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to send email: {e}'))
