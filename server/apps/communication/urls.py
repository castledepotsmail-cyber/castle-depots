from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, ContactMessageViewSet, NewsletterSubscriberViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'newsletter', NewsletterSubscriberViewSet, basename='newsletter')

urlpatterns = [
    path('', include(router.urls)),
]
