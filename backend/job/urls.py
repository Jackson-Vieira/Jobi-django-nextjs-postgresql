from django.urls import path
from . import views

from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'jobs', views.JobsViewSet)


urlpatterns = [
    path('stats/<str:topic>/', views.getTopicStats, name='get_topic_stats'),
    path('jobs/<str:id>/apply/', views.applyToJob, name='apply_to_job'),
    path('jobs/<str:id>/candidates/', views.getCandidatesApplied, name='get_candidate_list'),
    path('jobs/<str:id>/check/', views.isApplied, name='is_applied_job'),
    path('me/jobs/', views.getCurrentUserJobs, name='get_current_user_created_jobs'),
    path('me/jobs/applied/', views.getCurrentUserAppliedJobs, name='get_current_user_applied_jobs'),
]

urlpatterns += router.urls