from django.db import models
import uuid
from apps.products.models import Product, Category

class Campaign(models.Model):
    THEME_CHOICES = (
        ('default', 'Default Blue/Gold'),
        ('dark', 'Dark Mode'),
        ('red', 'Red Mode (Flash Sale)'),
        ('green', 'Green Mode (Holiday)'),
        ('custom', 'Custom Colors'),
    )

    SELECTION_CHOICES = (
        ('manual', 'Manual Selection'),
        ('category', 'Category Based'),
        ('all', 'All Products'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    # Theming
    theme_mode = models.CharField(max_length=20, choices=THEME_CHOICES, default='default')
    primary_color = models.CharField(max_length=7, blank=True, null=True, help_text="Hex code e.g. #FF0000")
    secondary_color = models.CharField(max_length=7, blank=True, null=True)
    accent_color = models.CharField(max_length=7, blank=True, null=True)
    
    # Product Targeting
    product_selection_type = models.CharField(max_length=20, choices=SELECTION_CHOICES, default='manual')
    target_category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaigns')
    products = models.ManyToManyField(Product, related_name='campaigns', blank=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.title

class CampaignBanner(models.Model):
    TYPE_CHOICES = (
        ('top_bar', 'Top Notification Bar'),
        ('hero_slide', 'Hero Carousel Slide'),
        ('flash_sale', 'Flash Sale Section'),
        ('popup', 'Popup Modal'),
        ('sidebar', 'Sidebar Ad'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='banners')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    is_active = models.BooleanField(default=True)
    
    # Content
    heading = models.CharField(max_length=255, blank=True)
    subheading = models.TextField(blank=True)
    image = models.ImageField(upload_to='campaigns/banners/', blank=True, null=True)
    link = models.CharField(max_length=500, blank=True, help_text="URL to redirect to")
    button_text = models.CharField(max_length=50, blank=True, default="Shop Now")
    
    # Display Logic
    # We'll store pages as a simple comma-separated string or JSON. JSON is better but SQLite sometimes tricky with JSONField in older Django versions. 
    # Assuming standard Django JSONField is available (Django 3.0+).
    display_pages = models.JSONField(default=list, help_text="List of pages to show this banner e.g. ['/', '/shop']")
    
    def __str__(self):
        return f"{self.campaign.title} - {self.get_type_display()}"
