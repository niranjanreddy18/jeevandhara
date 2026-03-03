import random
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import RegistrationOTP, CustomUser, ApprovedUniversityEmail
from .serializers import (
    SendOTPSerializer,
    VerifyOTPSerializer,
    CustomTokenObtainPairSerializer,
)


class SendOTPView(APIView):
    """Receive username/email/password, generate OTP, store in RegistrationOTP."""

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data
        # remove any previous OTP for this email
        RegistrationOTP.objects.filter(email=validated['email']).delete()
        otp = f"{random.randint(0, 999999):06d}"
        hashed_password = make_password(validated['password'])
        RegistrationOTP.objects.create(
            username=validated['username'],
            email=validated['email'],
            password=hashed_password,
            otp=otp,
        )
        # send OTP via email -- for now just print
        print(f"[OTP for {validated['email']}] {otp}")
        return Response({"message": "OTP sent (check console)"}, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """User submits OTP; if valid create CustomUser according to role."""

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        record = serializer.validated_data['record']
        email = record.email
        role = None
        # check admin existing user (very unlikely since email unique)
        if CustomUser.objects.filter(email=email, is_superuser=True).exists():
            role = None  # admin users rely on is_superuser
        elif ApprovedUniversityEmail.objects.filter(email=email).exists():
            role = "UNIVERSITY"
        else:
            role = "NORMAL_USER"

        user = CustomUser(
            username=record.username,
            email=email,
            role=role,
        )
        # if the email matched a superuser we would also set is_superuser=True
        if CustomUser.objects.filter(email=email, is_superuser=True).exists():
            user.is_superuser = True
            user.is_staff = True
        # assign hashed password directly to avoid re-hashing
        user.password = record.password
        user.save()

        # cleanup OTP record
        record.delete()
        return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
