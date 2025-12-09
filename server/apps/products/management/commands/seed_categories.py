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
                
                image_path = os.path.join(client_images_dir, cat_data['image_name'])
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        category.image.save(cat_data['image_name'], File(f), save=True)
                else:
                    self.stdout.write(self.style.WARNING(f"Image not found: {image_path}"))
                    category.save()
            else:
                self.stdout.write(f"Category already exists: {cat_data['name']}")

        self.stdout.write(self.style.SUCCESS('Successfully seeded categories'))
