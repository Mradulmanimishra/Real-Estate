from django.contrib import admin
from .models import PropertyListing, FavouriteProperty, Inquiry, Review

@admin.register(PropertyListing)
class PropertyListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'city', 'property_type', 'price', 'status', 'is_verified', 'seller_name', 'created_at')
    search_fields = ('title', 'city', 'seller_name')
    list_filter = ('property_type', 'city', 'seller_type', 'status', 'is_verified')
    list_editable = ('status', 'is_verified')

@admin.register(FavouriteProperty)
class FavouritePropertyAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'created_at')

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'property', 'created_at')
    search_fields = ('name', 'phone')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'rating', 'created_at')
    list_filter = ('rating',)
