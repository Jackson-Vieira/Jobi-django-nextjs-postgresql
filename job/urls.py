from django.urls import path
from . import views

from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'jobs', views.JobsViewSet)


urlpatterns = [
    path('stats/<str:topic>/', views.getTopicStats, name='get_topic_stats')
]

urlpatterns += router.urls