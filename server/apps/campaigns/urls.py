from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, CampaignBannerViewSet

router = DefaultRouter()
router.register(r'banners', CampaignBannerViewSet)
router.register(r'', CampaignViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
