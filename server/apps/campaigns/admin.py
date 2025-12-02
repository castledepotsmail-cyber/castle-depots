from django.contrib import admin
from .models import Campaign

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_time', 'end_time', 'is_active', 'theme_mode')
    list_filter = ('is_active', 'theme_mode')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('products',)
