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
                
                # For Vercel Blob or external storage, we would typically upload the file and get a URL.
                # Since we are seeding and don't have the Vercel Blob token here in the backend easily,
                # we will assume the images are served from the frontend public directory or a known Vercel Blob URL pattern.
                # For now, let's use the relative path which the frontend can resolve, OR a placeholder if we want to be strict.
                # If the user wants Vercel Blob, they should ideally provide the full URLs.
                # Let's assume the frontend serves them from /images/ for now, or we can update this later with real Blob URLs.
                
                # Update: User wants Vercel Blob. Since we can't upload from here easily without token,
                # we will store a relative path that the frontend can display, OR we can try to construct a URL if we knew the blob store.
                # Let's store '/images/' + image_name as a fallback, which works if the frontend serves it.
                # If we really want Vercel Blob, we'd need to upload them first.
                
                category.image = f"/images/{cat_data['image_name']}"
                category.save()
            else:
                self.stdout.write(f"Category already exists: {cat_data['name']}")

        self.stdout.write(self.style.SUCCESS('Successfully seeded categories'))
