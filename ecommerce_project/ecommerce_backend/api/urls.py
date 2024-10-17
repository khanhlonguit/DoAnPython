from django.urls import path
from . import views

urlpatterns = [
    # ... các đường dẫn hiện có ...
    path('register/', views.register_user, name='register'),
    path('verify-email/', views.verify_email, name='verify_email'),
    path('login/', views.login_user, name='login'),
    path('user-info/', views.user_info, name='user_info'),
]
