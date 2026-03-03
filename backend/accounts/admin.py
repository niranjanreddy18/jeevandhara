from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser, ApprovedUniversityEmail, RegistrationOTP


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'role', 'is_superuser', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )


@admin.register(ApprovedUniversityEmail)
class ApprovedUniversityEmailAdmin(admin.ModelAdmin):
    list_display = ('email',)


@admin.register(RegistrationOTP)
class RegistrationOTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'otp', 'created_at')
