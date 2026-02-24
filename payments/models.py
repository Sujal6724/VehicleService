from django.db import models
from core.models import TimeStampedModel
from bookings.models import Booking


class Payment(TimeStampedModel):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=150, unique=True)
    payment_status = models.CharField(max_length=50)
    gateway_response = models.JSONField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)


class Commission(TimeStampedModel):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    platform_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    platform_amount = models.DecimalField(max_digits=10, decimal_places=2)
    partner_payout = models.DecimalField(max_digits=10, decimal_places=2)