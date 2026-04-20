from django.urls import path
from .views import (
    RegisterUserView, VerifyEmailView, LoginUserView, TestAuthenticationView,
    PasswordResetRequestView, PasswordResetConfirm, SetNewPassword, LogoutUserView,
    DevVerifyUserView,
)

urlpatterns = [
    path('auth/register/', RegisterUserView.as_view(), name='register'),
    path('auth/verify-email/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('auth/login/', LoginUserView.as_view(), name='login'),
    path('auth/logout/', LogoutUserView.as_view(), name='logout'),
    path('auth/profile/', TestAuthenticationView.as_view(), name='auth-check'),

    path('auth/password-reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('auth/password-reset/confirm/<str:uidb64>/<str:token>/', PasswordResetConfirm.as_view(), name='password-reset-confirm'),
    path('auth/password-reset/setnewpassword/', SetNewPassword.as_view(), name='password-reset-setnewpassword'),

    # DEV ONLY — remove before production
    path('auth/dev-verify/', DevVerifyUserView.as_view(), name='dev-verify'),
]