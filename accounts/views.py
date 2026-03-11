from rest_framework import viewsets
from .models import PartnerProfile, PartnerService
from .serializers import PartnerProfileSerializer, PartnerServiceSerializer


class PartnerProfileViewSet(viewsets.ModelViewSet):
    queryset = PartnerProfile.objects.all()
    serializer_class = PartnerProfileSerializer


class PartnerServiceViewSet(viewsets.ModelViewSet):
    queryset = PartnerService.objects.all()
    serializer_class = PartnerServiceSerializer