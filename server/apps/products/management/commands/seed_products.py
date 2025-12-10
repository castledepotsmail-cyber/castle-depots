from django.core.management.base import BaseCommand
from apps.products.models import Product, Category
from django.core.files import File
from django.conf import settings
import os
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seeds the database with initial products'

    def handle(self, *args, **kwargs):
        products_data = [
            # Kitchenware
            {
                'name': 'Premium Gold Chafing Dish 8L',
                'slug': 'premium-gold-chafing-dish-8l',
                'category_slug': 'kitchenware',
                'price': '4500.00',
                'discount_price': '3800.00',
                'description': 'Elegant 8L chafing dish with gold finish, perfect for catering and events.',
                'image_name': 'cat_kitchenware.png' # Reusing category image
            },
            {
                'name': 'Non-Stick Cookware Set',
                'slug': 'non-stick-cookware-set',
                'category_slug': 'kitchenware',
                'price': '12000.00',
                'description': 'Complete 7-piece non-stick cookware set for all your cooking needs.',
                'image_name': 'cat_kitchenware.png'
            },
            
            # Fashion
            {
                'name': 'Ladies High-Waist Jeans',
                'slug': 'ladies-high-waist-jeans',
                'category_slug': 'fashion',
                'price': '1500.00',
                'discount_price': '1200.00',
                'description': 'Comfortable and stylish high-waist jeans for everyday wear.',
                'image_name': 'cat_fashion.png'
            },
            {
                'name': 'Summer Floral Dress',
                'slug': 'summer-floral-dress',
                'category_slug': 'fashion',
                'price': '2500.00',
                'description': 'Lightweight floral dress, perfect for summer outings.',
                'image_name': 'cat_fashion.png'
            },

            # Catering
            {
                'name': 'Stainless Steel Buffet Server',
                'slug': 'stainless-steel-buffet-server',
                'category_slug': 'catering',
                'price': '8500.00',
                'discount_price': '7999.00',
                'description': 'Professional grade buffet server with 3 compartments.',
                'image_name': 'cat_catering.png'
            },
            {
                'name': 'Commercial Juice Dispenser',
                'slug': 'commercial-juice-dispenser',
                'category_slug': 'catering',
                'price': '15000.00',
                'description': 'Double tank juice dispenser for high volume service.',
                'image_name': 'cat_catering.png'
            },

            # Electronics
            {
                'name': 'Smart LED TV 43 Inch',
                'slug': 'smart-led-tv-43-inch',
                'category_slug': 'electronics',
                'price': '28000.00',
                'discount_price': '24999.00',
                'description': 'Full HD Smart TV with built-in streaming apps.',
                'image_name': 'cat_electronics.png'
            },
            {
                'name': 'Bluetooth Soundbar',
                'slug': 'bluetooth-soundbar',
                'category_slug': 'electronics',
                'price': '6500.00',
                'description': 'Powerful soundbar with wireless subwoofer.',
                'image_name': 'cat_electronics.png'
            }
        ]

        client_images_dir = os.path.join(settings.BASE_DIR.parent, 'client', 'public', 'images')

        for prod_data in products_data:
            if not Product.objects.filter(slug=prod_data['slug']).exists():
                try:
                    category = Category.objects.get(slug=prod_data['category_slug'])
                    
                    self.stdout.write(f"Creating product: {prod_data['name']}")
                    product = Product(
                        name=prod_data['name'],
                        slug=prod_data['slug'],
                        category=category,
                        price=Decimal(prod_data['price']),
                        discount_price=Decimal(prod_data['discount_price']) if 'discount_price' in prod_data else None,
                        description=prod_data['description'],
                        stock_quantity=50, # Default stock
                        is_active=True,
                        allow_pod=True
                    )

                    product.image_main = f"/images/{prod_data['image_name']}"
                    product.save()
                
                except Category.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"Category not found: {prod_data['category_slug']}"))
            else:
                self.stdout.write(f"Product already exists: {prod_data['name']}")

        self.stdout.write(self.style.SUCCESS('Successfully seeded products'))
