from rest_framework import serializers
from django.db.models import Count, Sum, F, ExpressionWrapper, IntegerField
from django.db.models.functions import ExtractYear
from django.utils import timezone
from collections import defaultdict
from datetime import timedelta

from sejm_app.models import Club, Envoy, Interpellation

class ClubDetailSerializer(serializers.ModelSerializer):
    voting_stats = serializers.SerializerMethodField()
    interpellation_count = serializers.IntegerField()
    process_count = serializers.IntegerField()
    age_distribution = serializers.SerializerMethodField()
    district_distribution = serializers.SerializerMethodField()
    sex_distribution = serializers.SerializerMethodField()
    interpellations_per_month = serializers.SerializerMethodField()
    total_votes_number = serializers.SerializerMethodField()
    education_distribution = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ['id', 'name', 'phone', 'fax', 'email', 'membersCount', 'photo', 
                  'voting_stats', 'interpellation_count', 'process_count', 'age_distribution', 
                  'district_distribution', 'sex_distribution', 'interpellations_per_month', 
                  'total_votes_number', 'education_distribution']

    def get_voting_stats(self, obj):
        return {
            'total': obj.votes.count(),
            'yes': obj.votes.filter(yes__gt=0).count(),
            'no': obj.votes.filter(no__gt=0).count(),
            'abstain': obj.votes.filter(abstain__gt=0).count(),
        }

    def get_age_distribution(self, obj):
        current_year = timezone.now().year
        age_distribution = obj.envoys.annotate(
            age=ExpressionWrapper(
                current_year - ExtractYear('birthDate'),
                output_field=IntegerField()
            )
        ).values('age').annotate(count=Count('id')).order_by('age')

        # Group ages into ranges
        age_ranges = {
            '<30': 0, '30-39': 0, '40-49': 0, '50-59': 0, '60+': 0
        }
        for item in age_distribution:
            age = item['age']
            count = item['count']
            if age < 30:
                age_ranges['<30'] += count
            elif 30 <= age < 40:
                age_ranges['30-39'] += count
            elif 40 <= age < 50:
                age_ranges['40-49'] += count
            elif 50 <= age < 60:
                age_ranges['50-59'] += count
            else:
                age_ranges['60+'] += count

        return age_ranges

    def get_district_distribution(self, obj):
        return obj.envoys.values('districtName').annotate(count=Count('id'))

    def get_sex_distribution(self, obj):
        return obj.envoys.values('isFemale').annotate(count=Count('id'))

    def get_interpellations_per_month(self, obj):
        six_months_ago = timezone.now().date() - timedelta(days=180)
        return Interpellation.objects.filter(
            fromMember__club=obj,
            receiptDate__gte=six_months_ago
        ).values('receiptDate__year', 'receiptDate__month').annotate(count=Count('id'))

    def get_total_votes_number(self, obj):
        return obj.envoys.aggregate(total_votes=Sum('numberOfVotes'))['total_votes']

    def get_education_distribution(self, obj):
        return obj.envoys.values('educationLevel').annotate(count=Count('id'))