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

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'product_id', 'added_at']
        read_only_fields = ['user', 'added_at']
