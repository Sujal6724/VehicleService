from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet

router = DefaultRouter()
router.register('partners', PartnerViewSet)

urlpatterns = router.urls
