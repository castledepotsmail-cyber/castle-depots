from rest_framework import viewsets, permissions
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Users shouldn't create notifications, but if they do, it's for themselves?
        # Typically notifications are system generated.
        serializer.save(user=self.request.user)

from .models import ContactMessage
from .serializers import ContactMessageSerializer

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

from rest_framework.decorators import action
from rest_framework.response import Response
from .models import NewsletterSubscriber
from .serializers import NewsletterSubscriberSerializer

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=400)
        
        subscriber, created = NewsletterSubscriber.objects.get_or_create(email=email)
        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save()
            
        return Response({'message': 'Subscribed successfully'})

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def send_blast(self, request):
        subject = request.data.get('subject')
        message = request.data.get('message')
        test_email = request.data.get('test_email')

        if not subject or not message:
            return Response({'error': 'Subject and message are required'}, status=400)

        from django.core.management import call_command
        import threading

        # Run in background to avoid timeout
        def send_task():
            call_command('send_newsletter', subject, message, test_email=test_email)

        threading.Thread(target=send_task).start()

        return Response({'message': 'Newsletter sending started in background'})

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def test_smtp(self, request):
        """
        Synchronous email test to debug SMTP settings.
        POST /api/communication/newsletter/test_smtp/
        Body: {"email": "recipient@example.com"}
        """
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=400)

        from django.core.mail import send_mail
        from django.conf import settings
        import smtplib

        try:
            # Print settings for debug (be careful with passwords in real logs, but here we need to know)
            print(f"Testing SMTP with User: {settings.EMAIL_HOST_USER}")
            
            send_mail(
                'SMTP Test - Castle Depots',
                'If you are reading this, email sending is WORKING.',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return Response({'message': f'Successfully sent test email to {email}'})
        except smtplib.SMTPAuthenticationError as e:
            return Response({
                'error': 'SMTP Authentication Failed',
                'details': str(e),
                'hint': 'Check EMAIL_HOST_USER and EMAIL_HOST_PASSWORD. If using Gmail, ensure App Password is used.'
            }, status=500)
        except Exception as e:
            import traceback
            return Response({
                'error': 'Email Sending Failed',
                'type': type(e).__name__,
                'details': str(e),
                'traceback': traceback.format_exc()
            }, status=500)
