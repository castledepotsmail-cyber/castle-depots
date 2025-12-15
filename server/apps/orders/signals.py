from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from apps.orders.models import Order
from apps.communication.models import Notification

@receiver(pre_save, sender=Order)
def track_order_status_change(sender, instance, **kwargs):
    try:
        old_instance = Order.objects.get(pk=instance.pk)
        instance._old_status = old_instance.status
    except Order.DoesNotExist:
        instance._old_status = None

@receiver(post_save, sender=Order)
def create_order_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            type='order_placed',
            title='Order Placed Successfully',
            message=f"Your order #{str(instance.id)[:8]} has been placed successfully."
        )
        
        # Send Email
        from django.core.mail import send_mail
        from django.template.loader import render_to_string
        from django.utils.html import strip_tags
        from django.conf import settings

        try:
            subject = f'Order Placed #{str(instance.id)[:8]}'
            html_message = render_to_string('email/order_status_update.html', {'order': instance})
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [instance.user.email],
                html_message=html_message,
                html_message=html_message,
                fail_silently=False,
            )
            print(f"Email sent successfully to {instance.user.email}")
        except Exception as e:
            print(f"CRITICAL: Failed to send email to {instance.user.email}: {str(e)}")
            import traceback
            traceback.print_exc()
    else:
        # Check if status changed
        if hasattr(instance, '_old_status') and instance._old_status != instance.status:
            # Map status to notification type and title
            status_map = {
                'placed': ('order_placed', 'Order Placed'),
                'payment_confirmed': ('order_confirmed', 'Payment Confirmed'),
                'processing': ('order_processing', 'Order Processing'),
                'shipped': ('order_shipped', 'Order Shipped'),
                'delivered': ('order_delivered', 'Order Delivered'),
                'cancelled': ('order_cancelled', 'Order Cancelled'),
            }
            
            # Default to 'system' if status not found in map, though it should be covered
            notif_type, title = status_map.get(instance.status, ('system', 'Order Update'))
            
            # Special case for POD delivered but not paid
            if instance.status == 'delivered' and instance.payment_method == 'pod' and not instance.is_paid:
                message = f"Order #{str(instance.id)[:8]} has been delivered. Please complete your payment."
            else:
                message = f"Order #{str(instance.id)[:8]} status updated to {instance.get_status_display()}."

            Notification.objects.create(
                user=instance.user,
                type=notif_type,
                title=title,
                message=message
            )
            
            # Send Email
            from django.core.mail import send_mail
            from django.template.loader import render_to_string
            from django.utils.html import strip_tags
            from django.conf import settings

            try:
                subject = f'Order Update #{str(instance.id)[:8]} - {title}'
                html_message = render_to_string('email/order_status_update.html', {'order': instance})
                plain_message = strip_tags(html_message)
                
                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [instance.user.email],
                    html_message=html_message,
                html_message=html_message,
                fail_silently=False, 
            )
            print(f"Email sent successfully to {instance.user.email}")
        except Exception as e:
            print(f"CRITICAL: Failed to send email to {instance.user.email}: {str(e)}")
            import traceback
            traceback.print_exc()
