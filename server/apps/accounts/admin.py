from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Address

admin.site.register(User, UserAdmin)

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'full_name', 'city', 'is_default')
    list_filter = ('is_default', 'city')
    search_fields = ('user__username', 'full_name', 'street_address')
