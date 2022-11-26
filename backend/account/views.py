from django.shortcuts import render
from django.contrib.auth.hashers import make_password

from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import SignUpSerializer, UserSerializer
from .validators import validate_file_extension

@api_view(['POST'])
def register(request):
    data = request.data
    
    user = SignUpSerializer(data=data)

    if user.is_valid():
        if not User.objects.filter(username=data.get('email')).exists():
            user.save(username=data.get('email'), password=make_password(data.get('password'))) # move to serializer.py
            return Response(
            {'User registered.'}, 
            status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'message':'User already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
                )
    else:
        return Response(user.errors)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def currentUser(request):
    user = UserSerializer(request.user)
    return Response(user.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request):
    user = request.user
    
    data = request.data

    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.username = data['email']
    user.email = data['email']
    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()
    serializer = UserSerializer(user)
    
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def uploadResume(request):
    user = request.user
    resume = request.FILES['resume']
    print(resume)
    if resume == '':
        return Response({'error': 'Please upload your resume'})

    isValidFile =   validate_file_extension(resume.name)
    if not isValidFile:
        return Response({'error': 'Please upload only pdf files'})

    user.userprofile.resume = resume
    user.userprofile.save()
    serializer = UserSerializer(user, many=False)

    return Response({
        'message':'uploaded succesfully',
        'user':serializer.data
    })