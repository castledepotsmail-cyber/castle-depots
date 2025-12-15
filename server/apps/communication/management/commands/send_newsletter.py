from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Send a newsletter to all users'

    def add_arguments(self, parser):
        parser.add_argument('subject', type=str, help='Subject of the newsletter')
        parser.add_argument('message', type=str, help='HTML content of the newsletter')
        parser.add_argument('--test-email', type=str, help='Send only to this email for testing')

    def handle(self, *args, **options):
        subject = options['subject']
        message = options['message']
        test_email = options.get('test_email')

        if test_email:
            users = User.objects.filter(email=test_email)
            self.stdout.write(f"Sending test newsletter to {test_email}...")
        else:
            users = User.objects.all()
            self.stdout.write(f"Sending newsletter to {users.count()} users...")

        count = 0
        for user in users:
            try:
                html_message = render_to_string('email/newsletter.html', {
                    'user': user,
                    'title': subject,
                    'message': message
                })
                plain_message = strip_tags(html_message)

                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    html_message=html_message,
                    fail_silently=False,
                )
                count += 1
                self.stdout.write(f"Sent to {user.email}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to send to {user.email}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully sent {count} newsletters"))
