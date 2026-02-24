from django.db import models
from core.models import TimeStampedModel
from bookings.models import Booking
from accounts.models import User


class Complaint(TimeStampedModel):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    status = models.CharField(max_length=20, default="OPEN")
    resolution_note = models.TextField(null=True, blank=True)