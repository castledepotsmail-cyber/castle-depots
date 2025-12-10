from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price']
        read_only_fields = ['price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'payment_method', 'total_amount', 'delivery_address', 'items', 'created_at', 'paystack_ref', 'is_paid']
        read_only_fields = ['user', 'status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        try:
            order = Order.objects.create(user=user, **validated_data)
            
            for item_data in items_data:
                # We should probably validate product existence and price here or in view
                # For simplicity, assuming product_id is valid and we fetch price from product or trust client (don't trust client for price in real app)
                # Better: fetch product and set price from DB.
                from apps.products.models import Product
                product = Product.objects.get(id=item_data['product_id'])
                OrderItem.objects.create(order=order, product=product, price=product.price, quantity=item_data['quantity'])
                
            return order
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise serializers.ValidationError(f"Error creating order: {str(e)}")
