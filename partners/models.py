from django.db import models
from core.models import TimeStampedModel
from accounts.models import User
from services.models import ServiceCategory
from partners.models import PartnerProfile


class PartnerProfile(TimeStampedModel):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="partner_profile"
    )
    is_approved = models.BooleanField(default=False)
    is_available = models.BooleanField(default=False)
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)


class PartnerService(TimeStampedModel):
    partner = models.ForeignKey(PartnerProfile, on_delete=models.CASCADE)
    service = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("partner", "service")

    def __str__(self):
        return f"{self.partner} - {self.service}"