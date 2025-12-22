from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users see their own orders, Admins see all (if we add IsAdminUser permission logic later)
        # For now, just own orders
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        import logging
        logger = logging.getLogger(__name__)
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        old_status = instance.status
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        new_status = serializer.instance.status
        logger.info(f"Admin updated order {instance.id}. Status changed: {old_status} -> {new_status}")

        return Response(serializer.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.contrib.auth import get_user_model
from apps.products.models import Product

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_orders = Order.objects.count()
        total_revenue = Order.objects.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_customers = get_user_model().objects.count()
        total_products = Product.objects.count()
        
        # Recent orders
        recent_orders = OrderSerializer(Order.objects.all().order_by('-created_at')[:5], many=True).data
        
        return Response({
            'total_orders': total_orders,
            'total_revenue': total_revenue,
            'total_customers': total_customers,
            'total_products': total_products,
            'recent_orders': recent_orders
        })

class TrackOrderView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            return Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)

from math import radians, cos, sin, asin, sqrt
from rest_framework.decorators import action
from .models import StoreSettings
from .serializers import StoreSettingsSerializer

class StoreSettingsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser] 
    
    def list(self, request):
        settings = StoreSettings.objects.first()
        if not settings:
            # Return default empty structure or create default
            settings = StoreSettings.objects.create(store_address="Not Set", latitude=-1.2921, longitude=36.8219) # Default Nairobi
        return Response(StoreSettingsSerializer(settings).data)

    def create(self, request):
        # Update existing or create
        settings = StoreSettings.objects.first()
        if settings:
            serializer = StoreSettingsSerializer(settings, data=request.data)
        else:
            serializer = StoreSettingsSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def calculate_shipping(self, request):
        try:
            lat = float(request.query_params.get('lat'))
            lng = float(request.query_params.get('lng'))
        except (TypeError, ValueError):
            return Response({'error': 'Invalid coordinates'}, status=400)
            
        settings = StoreSettings.objects.first()
        if not settings:
             return Response({'cost': 0, 'distance': 0, 'message': 'Store location not set'})

        # Haversine formula
        R = 6371 # Earth radius in km
        dLat = radians(lat - settings.latitude)
        dLon = radians(lng - settings.longitude)
        a = sin(dLat/2) * sin(dLat/2) + cos(radians(settings.latitude)) * cos(radians(lat)) * sin(dLon/2) * sin(dLon/2)
        c = 2 * asin(sqrt(a))
        distance = R * c
        
        if settings.max_delivery_distance and distance > settings.max_delivery_distance:
             return Response({'error': 'Location is outside delivery range', 'distance': round(distance, 2)}, status=400)
             
        cost = float(settings.base_shipping_cost) + (distance * float(settings.cost_per_km))
        
        return Response({
            'cost': round(cost, 2),
            'distance': round(distance, 2),
            'store_location': {'lat': settings.latitude, 'lng': settings.longitude}
        })
