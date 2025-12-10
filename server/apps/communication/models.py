from django.db import models
import uuid
from django.conf import settings
from apps.orders.models import Order

class Notification(models.Model):
    TYPE_CHOICES = (
        ('order_placed', 'Order Placed'),
        ('order_confirmed', 'Order Confirmed'),
        ('order_processing', 'Order Processing'),
        ('order_shipped', 'Order Shipped'),
        ('order_delivered', 'Order Delivered'),
        ('order_cancelled', 'Order Cancelled'),
        ('payment_success', 'Payment Successful'),
        ('payment_failed', 'Payment Failed'),
        ('flash_sale', 'Flash Sale Alert'),
        ('new_product', 'New Product Available'),
        ('price_drop', 'Price Drop Alert'),
        ('back_in_stock', 'Back in Stock'),
        ('wishlist_sale', 'Wishlist Item on Sale'),
        ('account_update', 'Account Update'),
        ('security_alert', 'Security Alert'),
        ('review_reminder', 'Review Reminder'),
        ('support_response', 'Support Response'),
        ('promotion', 'Promotional Offer'),
        ('system', 'System Message'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notifications', on_delete=models.CASCADE)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.CharField(max_length=500, blank=True, null=True)  # Optional link to relevant page
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type} - {self.user.username}"

class SupportTicket(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tickets', on_delete=models.CASCADE)
    order = models.ForeignKey(Order, related_name='tickets', on_delete=models.SET_NULL, blank=True, null=True)
    subject = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    messages = models.JSONField(default=list) # List of {sender: 'user'/'admin', message: 'text', timestamp: 'dt'}
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket {self.id} - {self.subject}"

class ContactMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contact from {self.name} - {self.subject}"
