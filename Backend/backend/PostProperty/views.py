# views.py
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from .models import PropertyListing
from .serializers import PropertyListingSerializer

class PropertyListingCreateView(CreateAPIView):
    queryset = PropertyListing.objects.all()
    serializer_class = PropertyListingSerializer

class PropertyListingListView(ListAPIView):
    queryset = PropertyListing.objects.all().order_by('-created_at')
    serializer_class = PropertyListingSerializer

class PropertyDetailView(RetrieveAPIView):
    queryset = PropertyListing.objects.all()
    serializer_class = PropertyListingSerializer
    lookup_field = 'id'