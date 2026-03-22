from rest_framework import serializers
from .models import PropertyListing

class PropertyListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyListing
        fields = '__all__'