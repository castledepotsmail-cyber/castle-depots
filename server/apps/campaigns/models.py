from django.db import models
import uuid
from apps.products.models import Product

class Campaign(models.Model):
    THEME_CHOICES = (
        ('default', 'Default Blue/Gold'),
        ('dark', 'Dark Mode'),
        ('red', 'Red Mode (Flash Sale)'),
        ('green', 'Green Mode (Holiday)'),
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
    accent_color = models.CharField(max_length=7, blank=True, null=True)
    hero_image = models.ImageField(upload_to='campaigns/', blank=True, null=True)
    
    products = models.ManyToManyField(Product, related_name='campaigns', blank=True)

    def __str__(self):
        return self.title
