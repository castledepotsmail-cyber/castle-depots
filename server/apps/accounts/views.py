from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, GoogleAuthSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        print(f"Registration request data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                print(f"User created successfully: {user.username}")
                
                # Send Welcome Email & Notification
                try:
                    from apps.communication.models import Notification
                    from django.core.mail import send_mail
                    from django.template.loader import render_to_string
                    from django.utils.html import strip_tags
                    from django.conf import settings

                    # In-app notification
                    Notification.objects.create(
                        user=user,
                        type='welcome',
                        title='Welcome to Castle Depots!',
                        message='Thank you for joining us. We are excited to have you on board.'
                    )

                    # Email
                    subject = 'Welcome to Castle Depots!'
                    html_message = render_to_string('email/welcome.html', {'user': user})
                    plain_message = strip_tags(html_message)
                    
                    send_mail(
                        subject,
                        plain_message,
                        settings.DEFAULT_FROM_EMAIL,
                        [user.email],
                        html_message=html_message,
                        fail_silently=True,
                    )
                except Exception as e:
                    print(f"Failed to send welcome email/notification: {e}")

                return Response({
                    'message': 'User created successfully',
                    'user': UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Error creating user: {str(e)}")
                return Response({
                    'error': f'Error creating user: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        print(f"Registration validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Send email
                reset_link = f"https://castle-depots.vercel.app/auth/reset-password?uid={uid}&token={token}"
                
                from django.core.mail import send_mail
                from django.template.loader import render_to_string
                from django.utils.html import strip_tags
                from django.conf import settings

                subject = 'Reset Your Password - Castle Depots'
                html_message = render_to_string('email/password_reset.html', {'user': user, 'reset_link': reset_link})
                plain_message = strip_tags(html_message)
                
                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    html_message=html_message,
                    fail_silently=False,
                )
                
                print(f"PASSWORD RESET LINK for {email}: {reset_link}") # Keep for debug
                
                return Response({'message': 'Password reset link sent to email'}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                # Don't reveal user existence
                return Response({'message': 'Password reset link sent to email'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            uid = serializer.validated_data['uid']
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            try:
                uid_decoded = force_str(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=uid_decoded)
                
                if default_token_generator.check_token(user, token):
                    user.set_password(new_password)
                    user.save()
                    return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import viewsets, permissions
from .models import Address
from .serializers import AddressSerializer

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ManageUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def google_auth(request):
    print(f"Google auth request data: {request.data}")
    serializer = GoogleAuthSerializer(data=request.data)
    if serializer.is_valid():
        google_id = serializer.validated_data['google_id']
        email = serializer.validated_data['email']
        first_name = serializer.validated_data.get('first_name', '')
        last_name = serializer.validated_data.get('last_name', '')
        profile_picture = serializer.validated_data.get('profile_picture')
        
        user, created = User.objects.get_or_create(
            google_id=google_id,
            defaults={
                'email': email,
                'username': email,
                'first_name': first_name,
                'last_name': last_name,
                'profile_picture': profile_picture,
            }
        )
        
        if created:
             # Send Welcome Email & Notification
            try:
                from apps.communication.models import Notification
                from django.core.mail import send_mail
                from django.template.loader import render_to_string
                from django.utils.html import strip_tags
                from django.conf import settings

                # In-app notification
                Notification.objects.create(
                    user=user,
                    type='welcome',
                    title='Welcome to Castle Depots!',
                    message='Thank you for joining us via Google. We are excited to have you on board.'
                )

                # Email
                subject = 'Welcome to Castle Depots!'
                html_message = render_to_string('email/welcome.html', {'user': user})
                plain_message = strip_tags(html_message)
                
                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    html_message=html_message,
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Failed to send welcome email/notification: {e}")
        
        # Update profile picture if user exists
        if not created and profile_picture:
            user.profile_picture = profile_picture
            user.save()
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })
    print(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
