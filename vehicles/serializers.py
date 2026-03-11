from partners.models import PartnerService
from rest_framework import serializers
from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'user', 'brand', 'model', 'registration_number', 'fuel_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class PartnerServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerService
        fields = ['id', 'partner', 'service']