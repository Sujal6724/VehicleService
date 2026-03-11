from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerProfileViewSet, PartnerServiceViewSet

router = DefaultRouter()
router.register(r'partners', PartnerProfileViewSet)
router.register(r'partner-services', PartnerServiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]