from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'Backend is running'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', health_check, name='root_health_check'),
    path('api/health/', health_check, name='health_check'),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/communication/', include('apps.communication.urls')),
    path('api/campaigns/', include('apps.campaigns.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
