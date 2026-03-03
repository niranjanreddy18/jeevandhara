from django.db import models

# Create your models here.
class Universities(models.Model):
    university_name = models.CharField(max_length=255)
    official_email = models.EmailField()
    address = models.TextField()
    is_suspended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
