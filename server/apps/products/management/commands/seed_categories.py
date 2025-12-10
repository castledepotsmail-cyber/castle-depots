from django.core.management.base import BaseCommand
from apps.products.models import Category
from django.core.files import File
from django.conf import settings
import os

class Command(BaseCommand):
    help = 'Seeds the database with initial categories'

    def handle(self, *args, **kwargs):
        categories = [
            {
                'name': 'Kitchenware',
                'slug': 'kitchenware',
                'image_name': 'cat_kitchenware.png'
            },
            {
                'name': 'Fashion',
                'slug': 'fashion',
                'image_name': 'cat_fashion.png'
            },
            {
                'name': 'Catering',
                'slug': 'catering',
                'image_name': 'cat_catering.png'
            },
            {
                'name': 'Electronics',
                'slug': 'electronics',
                'image_name': 'cat_electronics.png'
            }
        ]

        # Path to client public images
        # Assuming server is at f:\castledepots\server and client is at f:\castledepots\client
        # We need to go up one level from BASE_DIR (server) to get to client
        client_images_dir = os.path.join(settings.BASE_DIR.parent, 'client', 'public', 'images')

        for cat_data in categories:
            if not Category.objects.filter(slug=cat_data['slug']).exists():
                self.stdout.write(f"Creating category: {cat_data['name']}")
                category = Category(
                    name=cat_data['name'],
                    slug=cat_data['slug']
                )
                
                # Vercel Blob URLs
                blob_base_url = "https://32vzkt6aqmhvgt9v.public.blob.vercel-storage.com/seed/"
                category.image = f"{blob_base_url}{cat_data['image_name']}"
                category.save()
            else:
                self.stdout.write(f"Category already exists: {cat_data['name']}")

        self.stdout.write(self.style.SUCCESS('Successfully seeded categories'))
