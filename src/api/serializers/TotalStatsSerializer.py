from loguru import logger
from rest_framework import serializers
from django.db.models import Count
from django.utils import timezone
from collections import defaultdict

from sejm_app.models.club import Club
from sejm_app.models.envoy import Envoy

class TotalStatsSerializer(serializers.Serializer):
    total_envoys = serializers.IntegerField()
    age_distribution = serializers.DictField(child=serializers.DictField())
    sex_distribution = serializers.DictField(child=serializers.DictField())
    district_distribution = serializers.DictField(child=serializers.DictField())

    def get_age_group(self, age):
        if age < 30:
            return '< 30'
        elif age < 40:
            return '30-39'
        elif age < 50:
            return '40-49'
        elif age < 60:
            return '50-59'
        elif age < 70:
            return '60-69'
        else:
            return '> 70'

    def to_representation(self, instance):
        logger.info(f'To representation')
        envoys = Envoy.objects.all()
        clubs = Club.objects.all().exclude(id="niez.")

        total_envoys = envoys.count()
        age_distribution = defaultdict(lambda: defaultdict(int))
        sex_distribution = defaultdict(lambda: defaultdict(int))
        district_distribution = defaultdict(lambda: defaultdict(int))

        current_year = timezone.now().year

        for envoy in envoys:
            club_id = envoy.club.id
            age = current_year - envoy.birthDate.year
            age_group = self.get_age_group(age)
            sex = 'Female' if envoy.isFemale else 'Male'

            age_distribution[club_id][age_group] += 1
            age_distribution['Total'][age_group] += 1

            sex_distribution[club_id][sex] += 1
            sex_distribution['Total'][sex] += 1

            district_distribution[club_id][envoy.districtName] += 1
            district_distribution['Total'][envoy.districtName] += 1
        return {
            'total_envoys': total_envoys,
            'age_distribution': dict(age_distribution),
            'sex_distribution': dict(sex_distribution),
            'district_distribution': dict(district_distribution)
        }