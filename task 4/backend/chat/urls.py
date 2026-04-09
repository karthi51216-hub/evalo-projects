

from django.urls import path
from .views import ChatView, ChatHistoryView

urlpatterns = [
    path('chat/', ChatView.as_view()),
    path('history/', ChatHistoryView.as_view()),
]