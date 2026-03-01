from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()
from hospital.serializers import  *
from university.serializers import  *
from .models import User
from hospital.models import HospitalInfo
from university.models import university

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'role', 'is_active']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data['role'],
            is_active=validated_data['is_active']
        )
        return user

from django.db import transaction

class RegisterWithProfileSerializer(serializers.ModelSerializer):

    hospital_info = HospitalInfoSerializer(required=False)
    university_info = UniversityCreateSerializer(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'password',
            'role',
            'is_active',
            'hospital_info',
            'university_info'
        ]

    @transaction.atomic
    def create(self, validated_data):

        hospital_data = validated_data.pop('hospital_info', None)
        university_data = validated_data.pop('university_info', None)

        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data['role'],
            is_active=validated_data['is_active']
        )

        if user.role == "hospital":
            if not hospital_data:
                raise serializers.ValidationError("Hospital data required")
            HospitalInfo.objects.create(user=user, **hospital_data)

        elif user.role == "university":
            if not university_data:
                raise serializers.ValidationError("University data required")
            university.objects.create(user=user, **university_data)

        else:
            raise serializers.ValidationError("Invalid role")

        return user
