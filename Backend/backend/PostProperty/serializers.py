from rest_framework import serializers
from .models import PropertyListing, FavouriteProperty, Inquiry, Review


class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user_email', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at', 'user_email']

    def get_user_email(self, obj):
        return obj.user.email


class PropertyListingSerializer(serializers.ModelSerializer):
    is_favourited = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = PropertyListing
        fields = '__all__'

    def get_is_favourited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FavouriteProperty.objects.filter(user=request.user, property=obj).exists()
        return False

    def get_avg_rating(self, obj):
        return obj.avg_rating

    def get_review_count(self, obj):
        return obj.review_count


class FavouritePropertySerializer(serializers.ModelSerializer):
    property_detail = PropertyListingSerializer(source='property', read_only=True)

    class Meta:
        model = FavouriteProperty
        fields = ['id', 'property', 'property_detail', 'created_at']
        read_only_fields = ['id', 'created_at']


class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ['id', 'name', 'phone', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']
