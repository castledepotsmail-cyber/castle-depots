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
        Comprehensive Network & SMTP Diagnostic
        """
        import socket
        import smtplib
        import ssl
        from django.conf import settings
        
        results = {
            'checks': [],
            'settings': {
                'EMAIL_HOST': settings.EMAIL_HOST,
                'EMAIL_PORT': settings.EMAIL_PORT,
                'EMAIL_USE_TLS': settings.EMAIL_USE_TLS,
                'EMAIL_HOST_USER': settings.EMAIL_HOST_USER,
                # Mask password
                'EMAIL_HOST_PASSWORD': '*' * len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else 'NOT SET'
            }
        }

        # 1. DNS Resolution
        try:
            ip = socket.gethostbyname(settings.EMAIL_HOST)
            results['checks'].append(f"DNS Resolution ({settings.EMAIL_HOST}): SUCCESS -> {ip}")
        except Exception as e:
            results['checks'].append(f"DNS Resolution ({settings.EMAIL_HOST}): FAILED -> {str(e)}")
            return Response(results, status=500)

        # 2. Socket Connection Test (Raw TCP)
        try:
            sock = socket.create_connection((settings.EMAIL_HOST, settings.EMAIL_PORT), timeout=10)
            results['checks'].append(f"TCP Connection to {settings.EMAIL_HOST}:{settings.EMAIL_PORT}: SUCCESS")
            sock.close()
        except Exception as e:
            results['checks'].append(f"TCP Connection to {settings.EMAIL_HOST}:{settings.EMAIL_PORT}: FAILED -> {str(e)}")
            # If 587 fails, try 465 just to see
            try:
                sock = socket.create_connection((settings.EMAIL_HOST, 465), timeout=5)
                results['checks'].append(f"TCP Connection to {settings.EMAIL_HOST}:465 (Alternative): SUCCESS")
                sock.close()
            except Exception as e2:
                results['checks'].append(f"TCP Connection to {settings.EMAIL_HOST}:465 (Alternative): FAILED -> {str(e2)}")
            
            return Response(results, status=500)

        # 3. SMTP Handshake
        try:
            if settings.EMAIL_USE_TLS:
                server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=10)
                server.set_debuglevel(1)
                server.ehlo()
                server.starttls()
                server.ehlo()
            else:
                server = smtplib.SMTP_SSL(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=10)
                server.ehlo()
            
            results['checks'].append("SMTP Handshake & TLS: SUCCESS")
            
            # 4. Authentication
            try:
                server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
                results['checks'].append("SMTP Login: SUCCESS")
                
                # 5. Send Mail
                email_to = request.data.get('email')
                if email_to:
                    server.sendmail(settings.EMAIL_HOST_USER, [email_to], 
                        f"Subject: SMTP Test\n\nThis is a test email from Castle Depots diagnostic tool.")
                    results['checks'].append(f"Email Send to {email_to}: SUCCESS")
                
                server.quit()
                return Response(results)
                
            except smtplib.SMTPAuthenticationError as e:
                results['checks'].append(f"SMTP Login: FAILED -> {str(e)}")
                return Response(results, status=500)
            except Exception as e:
                results['checks'].append(f"SMTP Error after handshake: {str(e)}")
                return Response(results, status=500)
                
        except Exception as e:
            results['checks'].append(f"SMTP Handshake: FAILED -> {str(e)}")
            return Response(results, status=500)
