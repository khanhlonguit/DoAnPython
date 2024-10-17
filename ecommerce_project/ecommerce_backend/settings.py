INSTALLED_APPS = [
    # ... các ứng dụng khác ...
    'rest_framework_simplejwt',
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # Hoặc máy chủ SMTP của bạn
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'hvklong@csc.hcmus.edu.vn'  # Email của bạn
EMAIL_HOST_PASSWORD = '01687256552'  # Mật khẩu email của bạn

FRONTEND_URL = 'http://localhost:3001'  # URL của frontend