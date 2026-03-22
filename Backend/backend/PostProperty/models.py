from django.db import models

FURNISHING_OPTIONS = [
    ('Furnished', 'Furnished'),
    ('Semi-Furnished', 'Semi-Furnished'),
    ('Unfurnished', 'Unfurnished'),
]

CONSTRUCTION_STATUS = [
    ('Ready to Move', 'Ready to Move'),
    ('Under Construction', 'Under Construction'),
]

AGE_OF_PROPERTY = [
    ('New', 'New'),
    ('Less than 5 years', 'Less than 5 years'),
    ('5-10 years', '5-10 years'),
    ('10+ years', '10+ years'),
]

SELLER_TYPE = [
    ('Owner', 'Owner'),
    ('Agent', 'Agent'),
    ('Builder', 'Builder'),
]

PROPERTY_TYPE = [
    ('House', 'House'),
    ('Apartment', 'Apartment'),
    ('Plot', 'Plot'),
    ('Commercial', 'Commercial'),
]

class PropertyListing(models.Model):
    # Step 1
    title = models.CharField(max_length=255)
    property_type = models.CharField(max_length=50, choices=PROPERTY_TYPE)
    size_sqft = models.CharField(max_length=100)
    bedrooms = models.PositiveIntegerField(null=True, blank=True)
    bathrooms = models.PositiveIntegerField(null=True, blank=True)
    furnishing_status = models.CharField(max_length=50, choices=FURNISHING_OPTIONS, blank=True)
    price = models.CharField(max_length=100)

    # Step 2
    city = models.CharField(max_length=100)
    locality = models.CharField(max_length=100)
    address = models.TextField()
    pincode = models.CharField(max_length=10)

    # Step 3
    construction_status = models.CharField(max_length=50, choices=CONSTRUCTION_STATUS)
    age_of_property = models.CharField(max_length=50, choices=AGE_OF_PROPERTY)
    floor_number = models.IntegerField()
    total_floors = models.IntegerField()
    parking = models.BooleanField()

    # Step 4 (Media)
    images = models.ImageField(upload_to='property_images/', null=True, blank=True)
    images = models.ImageField(upload_to='property_images/', null=True, blank=True)

    # Step 5
    seller_name = models.CharField(max_length=100)
    seller_contact = models.CharField(max_length=15)
    seller_email = models.EmailField()
    seller_type = models.CharField(max_length=20, choices=SELLER_TYPE)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.city}"