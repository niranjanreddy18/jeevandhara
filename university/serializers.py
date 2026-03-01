from rest_framework import serializers
from .models import university

class UniversityCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = university
        fields = [
            'university_name',
            'university_registration_number',
            'official_email',
            'official_phone_number',
            'address',
            'registration_certificate_file'
        ]