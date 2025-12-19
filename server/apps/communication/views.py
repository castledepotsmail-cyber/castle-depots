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
        Fast Network & SMTP Diagnostic (Timeout Protected)
        """
        import socket
        import smtplib
        from django.conf import settings
        import time
        #results
        results = {
            'checks': [],
            'settings': {
                'EMAIL_HOST': settings.EMAIL_HOST,
                'EMAIL_PORT': settings.EMAIL_PORT,
                'EMAIL_USE_TLS': settings.EMAIL_USE_TLS,
                'EMAIL_HOST_USER': settings.EMAIL_HOST_USER,
                'EMAIL_HOST_PASSWORD': '*' * len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else 'NOT SET'
            }
        }

        def log(msg):
            results['checks'].append(f"[{time.strftime('%H:%M:%S')}] {msg}")

        # 1. DNS Resolution (with manual timeout hack via socket default)
        original_timeout = socket.getdefaulttimeout()
        socket.setdefaulttimeout(3.0) # Global 3s timeout
        
        try:
            log(f"Resolving {settings.EMAIL_HOST}...")
            ip = socket.gethostbyname(settings.EMAIL_HOST)
            log(f"DNS Success: {ip}")
        except Exception as e:
            log(f"DNS Failed: {str(e)}")
            socket.setdefaulttimeout(original_timeout)
            return Response(results, status=500)

        # 2. TCP Connection
        try:
            log(f"Connecting to {settings.EMAIL_HOST}:{settings.EMAIL_PORT}...")
            sock = socket.create_connection((settings.EMAIL_HOST, settings.EMAIL_PORT), timeout=3.0)
            log("TCP Connection Success")
            sock.close()
        except Exception as e:
            log(f"TCP Connection Failed: {str(e)}")
            socket.setdefaulttimeout(original_timeout)
            return Response(results, status=500)

        # 3. SMTP Handshake
        try:
            log("Starting SMTP Handshake...")
            if settings.EMAIL_USE_TLS:
                server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=5.0)
                server.ehlo()
                server.starttls()
                server.ehlo()
            else:
                server = smtplib.SMTP_SSL(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=5.0)
                server.ehlo()
            
            log("SMTP Handshake Success")
            
            # 4. Login
            try:
                log(f"Authenticating as {settings.EMAIL_HOST_USER}...")
                server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
                log("Authentication Success")
                
                # 5. Send
                email_to = request.data.get('email')
                if email_to:
                    log(f"Sending test email to {email_to}...")
                    server.sendmail(settings.EMAIL_HOST_USER, [email_to], 
                        f"Subject: SMTP Test\n\nDiagnostic test successful.")
                    log("Email Sent Successfully")
                
                server.quit()
                socket.setdefaulttimeout(original_timeout)
                return Response(results)
                
            except Exception as e:
                log(f"Auth/Send Failed: {str(e)}")
                try: server.quit()
                except: pass
                socket.setdefaulttimeout(original_timeout)
                return Response(results, status=500)
                
        except Exception as e:
            log(f"SMTP Handshake Failed: {str(e)}")
            socket.setdefaulttimeout(original_timeout)
            return Response(results, status=500)
