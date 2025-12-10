from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, AdminOrderViewSet, AdminStatsView, TrackOrderView

router = DefaultRouter()
router.register(r'admin', AdminOrderViewSet, basename='admin-order')
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('track/<uuid:pk>/', TrackOrderView.as_view(), name='track-order'),
    path('', include(router.urls)),
]
    path('', include(router.urls)),
]
