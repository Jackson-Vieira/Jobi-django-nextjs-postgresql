from django.shortcuts import render, get_object_or_404

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from django_filters.rest_framework import DjangoFilterBackend

from .models import Job
from .filters import JobsFilter
from .serializers import JobSerializer

from django.db.models import Avg, Min, Max, Count



# Create your views here.
class JobsViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
                   
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    # Filter and Search
    filter_backends = (DjangoFilterBackend,)
    filterset_class = JobsFilter

    # Pagination
    pagination_class = PageNumberPagination # Basic 
    pagination_class.page_size = 3


    #permissions
    permission_classes = [IsAuthenticatedOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        job = self.get_object()
        if job.user == request.user:
            return super().destroy(request, *args, **kwargs)
        else:
            return Response({'message':'You can not delete this job'},status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        job = self.get_object()
        if job.user == request.user:
            return super().update(request, *args, **kwargs)
        else:
            return Response({'message':'You can not edit this job'},status=status.HTTP_403_FORBIDDEN)
        
@api_view(['GET'])
def getTopicStats(request, topic):
    args = {'title__icontains':topic}
    jobs = Job.objects.filter(**args)
    
    if len(jobs) == 0:
        return Response({f'message': 'Not stats found for {topic}'})

    stats = jobs.aggregate(
        total_jobs = Count('title'),
        avg_positions = Avg('positions'),
        avg_salary = Avg('salary'),
        min_salary = Min('salary'),
        max_salary = Max('salary')
    )

    return Response(stats)