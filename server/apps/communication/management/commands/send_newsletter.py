from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from apps.communication.models import NewsletterSubscriber

class Command(BaseCommand):
    help = 'Send a newsletter to all subscribers'

    def add_arguments(self, parser):
        parser.add_argument('subject', type=str, help='Subject of the newsletter')
        parser.add_argument('message', type=str, help='HTML content of the newsletter')
        parser.add_argument('--test-email', type=str, help='Send only to this email for testing')

    def handle(self, *args, **options):
        subject = options['subject']
        message = options['message']
        test_email = options.get('test_email')

        if test_email:
            # Create a dummy object for test
            subscribers = [{'email': test_email}]
            self.stdout.write(f"Sending test newsletter to {test_email}...")
        else:
            subscribers = NewsletterSubscriber.objects.filter(is_active=True)
            self.stdout.write(f"Sending newsletter to {subscribers.count()} subscribers...")

        count = 0
        for sub in subscribers:
            email = sub['email'] if isinstance(sub, dict) else sub.email
            try:
                # We can use a simpler template or just send the message directly if it's already HTML
                # But wrapping it in a base template is better.
                # For now, let's assume message IS the HTML body or part of it.
                
                # If we have a template, use it. If not, just send the message.
                try:
                    html_message = render_to_string('email/newsletter.html', {
                        'title': subject,
                        'message': message,
                        'unsubscribe_url': f"{settings.NEXTJS_API_URL}/unsubscribe?email={email}"
                    })
                except Exception:
                    # Fallback if template doesn't exist
                    html_message = f"<html><body>{message}</body></html>"

                plain_message = strip_tags(html_message)

                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    html_message=html_message,
                    fail_silently=False,
                )
                count += 1
                self.stdout.write(f"Sent to {email}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to send to {email}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully sent {count} newsletters"))
