from django.db import models
from core.models import TimeStampedModel
from accounts.models import User


class Notification(TimeStampedModel):
    CHANNEL_CHOICES = (
        ("PUSH", "Push"),
        ("SMS", "SMS"),
        ("EMAIL", "Email"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    message = models.TextField()
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    is_read = models.BooleanField(default=False)