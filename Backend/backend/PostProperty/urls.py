# property/urls.py
from django.urls import path
from .views import (
    PropertyListingCreateView,
    PropertyListingListView,
    PropertyDetailView
)

urlpatterns = [
    path('sell/', PropertyListingCreateView.as_view(), name='property-sell'),
    path('buy/', PropertyListingListView.as_view(), name='property-buy'),
    path('property/<int:id>/', PropertyDetailView.as_view(), name='property-detail'),
]