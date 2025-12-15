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
