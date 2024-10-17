from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Product, Review, User, Cart, CartItem
# Tạo một lớp UserAdmin tùy chỉnh
class CustomUserAdmin(UserAdmin):
    # Thêm các tùy chỉnh của bạn ở đây nếu cần
    pass

# Hủy đăng ký mô hình User mặc định
if User in admin.site._registry:
    admin.site.unregister(User)
admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Cart)
admin.site.register(CartItem)


# Đăng ký lại mô hình User với admin class tùy chỉnh
admin.site.register(User, CustomUserAdmin)
