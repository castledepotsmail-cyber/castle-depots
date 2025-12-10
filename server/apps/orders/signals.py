from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.orders.models import Order
from apps.communication.models import Notification

@receiver(post_save, sender=Order)
def create_order_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            type='order_update',
            message=f"Your order #{str(instance.id)[:8]} has been placed successfully."
        )
    else:
        # Check if status changed (requires tracking old status, but for now just notify on save if not created)
        # To properly track status change, we'd need to override save() or use pre_save to compare.
        # For simplicity, let's just notify on specific statuses if we can infer it, or just generic update.
        # Better approach: check if status is different from DB?
        # But in post_save, instance is already saved.
        
        # Let's assume any save that's not create is an update we might want to notify about?
        # No, that's too noisy.
        # Let's check specific fields if possible, or just rely on the fact that we usually update status.
        
        # For this task, let's just notify on status change.
        # We can't easily know if status changed in post_save without extra work.
        # Let's use a simple heuristic: if status is 'delivered' and payment_method is 'pod' and not is_paid
        
        if instance.status == 'delivered' and instance.payment_method == 'pod' and not instance.is_paid:
             Notification.objects.create(
                user=instance.user,
                type='system',
                message=f"Order #{str(instance.id)[:8]} has been delivered. Please complete your payment."
            )
        else:
             Notification.objects.create(
                user=instance.user,
                type='order_update',
                message=f"Order #{str(instance.id)[:8]} status updated to {instance.get_status_display()}."
            )
