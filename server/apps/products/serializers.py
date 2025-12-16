from rest_framework import serializers
from .models import Product, Category, Wishlist, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.CharField(max_length=500),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = ['id', 'category', 'category_id', 'name', 'slug', 'description', 
                  'price', 'discount_price', 'stock_quantity', 'image_main', 
                  'is_active', 'allow_pod', 'created_at', 'images', 'uploaded_images']

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
            # For simplicity, we can clear old images and add new ones, 
            # or append. Usually replacing is safer for "edit" forms unless specific "add" logic exists.
            # Let's assume the frontend sends the COMPLETE list of desired images.
            # BUT, existing images have IDs. 
            # If the user wants to KEEP existing images, they should be re-sent or we need a smarter diff.
            # A simple approach for now: Clear all and re-create. 
            # Or better: The frontend sends a list of URL strings. 
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
