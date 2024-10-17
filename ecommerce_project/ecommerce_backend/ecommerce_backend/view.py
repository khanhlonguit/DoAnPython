from django.http import HttpResponse

def home(request):
    return HttpResponse("Chào mừng đến với trang chủ của ứng dụng ecommerce!")