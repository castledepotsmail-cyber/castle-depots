from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.products.models import Product, Category
from apps.orders.models import Order
from django.core import mail

User = get_user_model()

class OrderEmailNotificationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.admin = User.objects.create_superuser(username='admin', email='admin@castledepots.com', password='adminpassword')
        
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.product = Product.objects.create(
            name='Test Product',
            price=1000.00,
            stock_quantity=10,
            category=self.category,
            sku='TEST-SKU-001',
            image_main='http://example.com/image.jpg'
        )
        
        self.client.force_authenticate(user=self.user)

    def test_order_creation_sends_email_to_admin(self):
        # Clear outbox
        mail.outbox = []
        
        order_data = {
            'items': [
                {
                    'product_id': str(self.product.id),
                    'quantity': 1
                }
            ],
            'total_amount': 1000.00,
            'payment_method': 'paystack',
            'delivery_address': 'Test Address',
            'shipping_cost': 0
        }
        
        response = self.client.post('/api/orders/', order_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check that one message has been sent to the admin
        # Note: Depending on other signals, there might be user notification too. 
        # But we specifically look for the admin notification.
        
        # Filter for email sent to admin
        admin_emails = [m for m in mail.outbox if 'admin@castledepots.com' in m.to]
        self.assertTrue(len(admin_emails) > 0, "Admin should receive an email")
        
        email = admin_emails[0]
        self.assertIn("New Order", email.subject)
        self.assertIn("TEST-SKU-001", email.alternatives[0][0] if email.alternatives else email.body) # Check SKU is in body
