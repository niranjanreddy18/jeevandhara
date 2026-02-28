from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES=[
        ('ADMIN','admin'),
        ('HOSPITAL','hospital'),
        ('UNIVERSITY','university'),
    ]
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        null=True,
        blank=True
    )
    def __str__(self):
        return self.email





