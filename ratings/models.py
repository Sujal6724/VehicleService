from django.db import models
from core.models import TimeStampedModel
from bookings.models import Booking
from accounts.models import User


class Rating(TimeStampedModel):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    partner = models.ForeignKey(User, related_name="ratings", on_delete=models.CASCADE)

    rating = models.IntegerField()
    feedback = models.TextField(null=True, blank=True)