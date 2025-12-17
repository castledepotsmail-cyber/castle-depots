from rest_framework import viewsets, permissions, decorators, response
from django.utils import timezone
from .models import Campaign, CampaignBanner
from .serializers import CampaignSerializer, CampaignBannerSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all().order_by('-start_time')
    serializer_class = CampaignSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'active']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @decorators.action(detail=False, methods=['get'])
    def active(self, request):
        now = timezone.now()
        active_campaigns = Campaign.objects.filter(
            is_active=True,
            start_time__lte=now,
            end_time__gte=now
        )
        serializer = self.get_serializer(active_campaigns, many=True)
        return response.Response(serializer.data)

class CampaignBannerViewSet(viewsets.ModelViewSet):
    queryset = CampaignBanner.objects.all()
    serializer_class = CampaignBannerSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
