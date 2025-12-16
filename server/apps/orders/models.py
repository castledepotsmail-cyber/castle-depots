from django.db import models
import uuid
from django.conf import settings
from apps.products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('placed', 'Order Placed'),
        ('payment_confirmed', 'Payment Confirmed'),
        ('processing', 'Processing/Packing'),
        ('shipped', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    
    PAYMENT_METHOD_CHOICES = (
        ('paystack', 'Paystack (Card/M-Pesa)'),
        ('pod', 'Pay on Delivery'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='placed')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment Details
    paystack_ref = models.CharField(max_length=100, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    
    # Delivery Details
    delivery_address = models.TextField()
    delivery_latitude = models.FloatField(blank=True, null=True)
    delivery_longitude = models.FloatField(blank=True, null=True)
    tracking_notes = models.TextField(blank=True, help_text="Internal notes for tracking")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price at time of purchase

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
