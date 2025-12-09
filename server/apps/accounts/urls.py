from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, AddressViewSet, ManageUserView, AdminUserViewSet, google_auth, PasswordResetRequestView, PasswordResetConfirmView

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'users', AdminUserViewSet, basename='admin-user')

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('google-auth/', google_auth, name='google_auth'),
    path('me/', ManageUserView.as_view(), name='me'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('', include(router.urls)),
]
