from django.urls import path
from .views import (
    PropertyListingCreateView, PropertyListingListView, PropertyDetailView,
    SimilarPropertiesView, UserListingsView, UserListingDeleteView,
    ToggleFavouriteView, FavouriteListView,
    PropertyInquiryView, PropertyReviewView,
    AIChatView, PriceTrendView,
)

urlpatterns = [
    # Core
    path('sell/', PropertyListingCreateView.as_view(), name='property-sell'),
    path('buy/', PropertyListingListView.as_view(), name='property-buy'),
    path('property/<int:id>/', PropertyDetailView.as_view(), name='property-detail'),
    path('property/<int:id>/similar/', SimilarPropertiesView.as_view(), name='property-similar'),

    # User listings
    path('my-listings/', UserListingsView.as_view(), name='my-listings'),
    path('my-listings/<int:id>/delete/', UserListingDeleteView.as_view(), name='listing-delete'),

    # Favourites
    path('favourites/', FavouriteListView.as_view(), name='favourites-list'),
    path('favourites/<int:property_id>/toggle/', ToggleFavouriteView.as_view(), name='favourite-toggle'),

    # Inquiry
    path('property/<int:property_id>/inquiry/', PropertyInquiryView.as_view(), name='property-inquiry'),

    # Reviews
    path('property/<int:property_id>/reviews/', PropertyReviewView.as_view(), name='property-reviews'),

    # AI Chat
    path('chat/', AIChatView.as_view(), name='ai-chat'),

    # Price Trend
    path('price-trend/', PriceTrendView.as_view(), name='price-trend'),
]
