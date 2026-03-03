from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta


class CustomUser(AbstractUser):
    # email is the unique identifier for authentication
    email = models.EmailField(unique=True)
    # role field only used for UNIVERSITY or NORMAL_USER; admins use is_superuser
    ROLE_CHOICES = [
        ("UNIVERSITY", "UNIVERSITY"),
        ("NORMAL_USER", "NORMAL_USER"),
    ]
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        null=True,
        blank=True,
        help_text="Only set for university/normal users; admin users have is_superuser=True",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email


class ApprovedUniversityEmail(models.Model):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email


class RegistrationOTP(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField()
    password = models.CharField(max_length=128)  # hashed password
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

