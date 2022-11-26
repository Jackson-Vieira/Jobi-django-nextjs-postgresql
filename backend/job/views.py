from django.utils import timezone
from django.shortcuts import render, get_object_or_404

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import permission_classes

from django_filters.rest_framework import DjangoFilterBackend

from .models import Job, CandidatesApplied
from .filters import JobsFilter
from .serializers import JobSerializer, CandidatesAppliedSerializer

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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def applyToJob(request, id):
    user = request.user 
    job = get_object_or_404(Job, id=id)

    #validators
    if user.userprofile.resume == '':
        return Response({'error': 'Please upload your resume first'}, status=status.HTTP_400_BAD_REQUEST)
    if job.lastDate < timezone.now():
        return Response({'error': 'You can not apply to this JOb. Date is over.'}, status=status.HTTP_400_BAD_REQUEST)
    alreadyApplied = job.candidates_applied.filter(user=user).exists()
    if alreadyApplied:
        return Response({'error': 'You have already apply to this job.'}, status=status.HTTP_400_BAD_REQUEST)
    
    jobApplied = CandidatesApplied.objects.create(
        user=user, 
        job=job, 
        resume=user.userprofile.resume
        )

    return Response({
        'applied': True,
        'job_id': jobApplied.id,
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCurrentUserAppliedJobs(request):
    user = request.user
    # args = {'user_id': request.user.id}
    # jobs = CandidatesApplied.objects.filter(**args)
    applieds_jobs = CandidatesAppliedSerializer(user.applied_jobs, many=True)
    return Response(applieds_jobs.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def isApplied(request, id):
    user = request.user
    job = get_object_or_404(Job, id=id)

    applied = job.candidates_applied.filter(user=user).exists()

    return Response(applied)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCurrentUserJobs(request):
    args = {'user_id':request.user.id}

    jobs = Job.objects.filter(**args)

    serializers = JobSerializer(jobs, many=True)
    return Response(serializers.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCandidatesApplied(request, id):
    user = request.user
    job = get_object_or_404(Job, id=id)

    if job.user != user:
        return Response({'error': 'You can not acces this job'}, status=status.HTTP_403_FORBIDDEN)

    candidates = job.candidates_applied.all()
    serializer = CandidatesAppliedSerializer(candidates, many=True)

    return Response(serializer.data)