from rest_framework import serializers
from .models import Product, Category, Wishlist, ProductImage, Review

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    product_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'product_id', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        product_id = validated_data['product_id']
        
        # Check if user has purchased the product and it is delivered & paid
        from apps.orders.models import OrderItem
        has_purchased = OrderItem.objects.filter(
            order__user=user,
            product_id=product_id,
            order__status='delivered',
            order__is_paid=True
        ).exists()
        
        if not has_purchased:
            raise serializers.ValidationError("You can only review products you have purchased, paid for, and received.")
            
        # Check if already reviewed
        if Review.objects.filter(user=user, product_id=product_id).exists():
            raise serializers.ValidationError("You have already reviewed this product.")
            
        validated_data['user'] = user
        return super().create(validated_data)

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.CharField(max_length=500),
        write_only=True,
        required=False
    )
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'category', 'category_id', 'name', 'slug', 'description', 
                  'price', 'discount_price', 'stock_quantity', 'image_main', 
                  'is_active', 'allow_pod', 'created_at', 'images', 'uploaded_images',
                  'average_rating', 'review_count', 'reviews']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)
        
        for image_url in uploaded_images:
            ProductImage.objects.create(product=product, image=image_url)
            
        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', None)
        
        # Update standard fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update images if provided
        if uploaded_images is not None:
            instance.images.all().delete()
            for image_url in uploaded_images:
                ProductImage.objects.create(product=instance, image=image_url)
                
        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        
        # Calculate campaign discount
        from django.utils import timezone
        from apps.campaigns.models import Campaign
        
        now = timezone.now()
        # Optimize: Prefetch or cache this if possible, but for now direct query is safer for correctness
        active_campaigns = Campaign.objects.filter(
            start_time__lte=now,
            end_time__gte=now,
            is_active=True
        )
        
        best_discount = 0
        
        for campaign in active_campaigns:
            is_included = False
            if campaign.product_selection_type == 'all':
                is_included = True
            elif campaign.product_selection_type == 'category':
                if instance.category_id == campaign.target_category_id:
                    is_included = True
            elif campaign.product_selection_type == 'manual':
                # This might be N+1 query issue if listing many products. 
                # Ideally we should prefetch campaigns on the viewset.
                if campaign.products.filter(id=instance.id).exists():
                    is_included = True
            
            if is_included:
                if campaign.discount_percentage > best_discount:
                    best_discount = campaign.discount_percentage
        
        if best_discount > 0:
            original_price = float(instance.price)
            discount_amount = original_price * (float(best_discount) / 100)
            new_price = original_price - discount_amount
            
            # Check against existing discount_price
            current_discount_price = float(ret['discount_price']) if ret['discount_price'] else None
            
            if current_discount_price is None or new_price < current_discount_price:
                ret['discount_price'] = "{:.2f}".format(new_price)
                
        return ret

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'product_id', 'added_at']
        read_only_fields = ['user', 'added_at']
