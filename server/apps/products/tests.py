from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Product, Category
from decimal import Decimal

class ProductTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Kitchen', slug='kitchen')
        self.product1 = Product.objects.create(
            name='Expensive Item',
            slug='expensive-item',
            category=self.category,
            price=Decimal('100.00'),
            description='A very expensive item'
        )
        self.product2 = Product.objects.create(
            name='Cheap Item',
            slug='cheap-item',
            category=self.category,
            price=Decimal('20.00'),
            discount_price=Decimal('15.00'),
            description='A cheap item on sale'
        )

    def test_get_all_products(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_by_category(self):
        response = self.client.get('/api/products/', {'category__slug': 'kitchen'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        response = self.client.get('/api/products/', {'category__slug': 'non-existent'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_filter_by_on_sale(self):
        response = self.client.get('/api/products/', {'on_sale': 'true'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(self.product2.id))

    def test_filter_by_price_range(self):
        # Test price__lte
        response = self.client.get('/api/products/', {'price__lte': '50'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(self.product2.id))

        # Test price__gte
        response = self.client.get('/api/products/', {'price__gte': '50'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(self.product1.id))
