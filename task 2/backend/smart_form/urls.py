

from django.urls import path
from .views import SmartFormView

urlpatterns = [
    path('form-submit/', SmartFormView.as_view(), name='smart-form'),
]