from django.db import models
import uuid
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    image = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stock_quantity = models.IntegerField(default=0)
    image_main = models.CharField(max_length=500)
    is_active = models.BooleanField(default=True)
    allow_pod = models.BooleanField(default=True, help_text="Allow Payment on Delivery")
    options = models.JSONField(default=list, blank=True, help_text="List of product options (e.g. Size, Color)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return round(reviews.aggregate(models.Avg('rating'))['rating__avg'], 1)
        return 0

    review_count = property(lambda self: self.reviews.count())

    sku = models.CharField(max_length=50, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.sku:
            import random
            import string
            while True:
                # Generate a random SKU like 'SKU-123456'
                random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
                new_sku = f"SKU-{random_string}"
                if not Product.objects.filter(sku=new_sku).exists():
                    self.sku = new_sku
                    break
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product.name}"

class Wishlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='wishlist', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='wishlisted_by', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user} - {self.product}"

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reviews', on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product') # One review per product per user

    def __str__(self):
        return f"{self.user}'s review on {self.product}"
