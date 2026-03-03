from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser, RegistrationOTP, ApprovedUniversityEmail
from django.utils import timezone
from datetime import timedelta


class SendOTPSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # ensure unique username/email among users
        if CustomUser.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already taken")
        if CustomUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already registered")
        return data


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            record = RegistrationOTP.objects.get(email=data['email'], otp=data['otp'])
        except RegistrationOTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP")

        if record.is_expired():
            record.delete()
            raise serializers.ValidationError("OTP has expired")

        data['record'] = record
        return data


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        # determine role
        if user.is_superuser:
            role = "ADMIN"
        elif ApprovedUniversityEmail.objects.filter(email=user.email).exists():
            role = "UNIVERSITY"
        else:
            role = "NORMAL_USER"

        data.update({
            "message": "Login successful",
            "role": role,
            "username": user.username,
            "email": user.email,
        })
        return data
