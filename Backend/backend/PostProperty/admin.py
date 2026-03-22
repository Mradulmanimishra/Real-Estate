from django.contrib import admin
from .models import PropertyListing

@admin.register(PropertyListing)
class PropertyListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'city', 'property_type', 'price', 'seller_name', 'created_at')
    search_fields = ('title', 'city', 'seller_name')
    list_filter = ('property_type', 'city', 'seller_type')