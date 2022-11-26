from django_filters import rest_framework as filters
from .models import Job

class JobsFilter(filters.FilterSet):

    # Searches
    keyword = filters.CharFilter(field_name="title", lookup_expr='icontains')
    location = filters.CharFilter(field_name="address", lookup_expr='icontains')

    # Filters
    min_salary = filters.NumberFilter(field_name='salary', lookup_expr="gte")
    max_salary = filters.NumberFilter(field_name='salary', lookup_expr="lte")

    class Meta:
        model = Job
        fields = ('keyword','location', 'education', 'jobType', 'experience', 'min_salary', 'max_salary')
