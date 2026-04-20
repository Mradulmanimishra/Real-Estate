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

STATUS_CHOICES = [
    ('Active', 'Active'),
    ('Sold', 'Sold'),
    ('Under Review', 'Under Review'),
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

    # Phase 2 additions
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Phase 3 additions
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.city}"

    @property
    def avg_rating(self):
        reviews = self.reviews.all()
        if not reviews:
            return None
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    @property
    def review_count(self):
        return self.reviews.count()


class FavouriteProperty(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='favourites')
    property = models.ForeignKey(PropertyListing, on_delete=models.CASCADE, related_name='favourited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')

    def __str__(self):
        return f"{self.user.email} → {self.property.title}"


class Inquiry(models.Model):
    property = models.ForeignKey(PropertyListing, on_delete=models.CASCADE, related_name='inquiries')
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='inquiries', null=True, blank=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry by {self.name} on {self.property.title}"


RATING_CHOICES = [(i, i) for i in range(1, 6)]

class Review(models.Model):
    property = models.ForeignKey(PropertyListing, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')

    def __str__(self):
        return f"{self.user.email} → {self.property.title} ({self.rating}★)"
