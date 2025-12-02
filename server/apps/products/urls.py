from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, WishlistViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
# We register products at the root of this app's URLs or under 'products'
# Since the main urls.py likely points to this with 'api/products/', we can just register 'products' here?
# Usually it's better to have empty string if the prefix is in main urls.
# Let's check main urls.py to see how it's included.
# Assuming I'll add `path('api/products/', include('apps.products.urls'))`

router.register(r'', ProductViewSet) # This will be api/products/

urlpatterns = [
    path('', include(router.urls)),
]
