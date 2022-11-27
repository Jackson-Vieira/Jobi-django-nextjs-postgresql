from rest_framework import serializers

from .models import Job, CandidatesApplied

class JobSerializer(serializers.ModelSerializer):
    candidates = serializers.SerializerMethodField()

    def get_candidates(self, obj):
        return obj.candidates_applied.all().count()

    class Meta:
        model = Job 
        fields = '__all__'
        extra_fields = ['candidates']


class CandidatesAppliedSerializer(serializers.ModelSerializer):
    job = JobSerializer()
    class Meta:
        model = CandidatesApplied
        fields = ('job', 'user', 'resume', 'appliedAt')
    