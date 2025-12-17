from rest_framework import serializers
from .models import Campaign, CampaignBanner
from apps.products.serializers import ProductSerializer

class CampaignBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignBanner
        fields = '__all__'

class CampaignSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    banners = CampaignBannerSerializer(many=True, read_only=True)
    product_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Campaign
        fields = '__all__'

    def create(self, validated_data):
        product_ids = validated_data.pop('product_ids', [])
        campaign = Campaign.objects.create(**validated_data)
        if product_ids:
            campaign.products.set(product_ids)
        return campaign

    def update(self, instance, validated_data):
        product_ids = validated_data.pop('product_ids', None)
        instance = super().update(instance, validated_data)
        if product_ids is not None:
            instance.products.set(product_ids)
        return instance
