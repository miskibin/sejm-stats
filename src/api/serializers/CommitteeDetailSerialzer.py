from rest_framework import serializers
from django.db.models import Prefetch
from sejm_app.models import Committee, CommitteeMember, CommitteeSitting, Envoy, PrintModel
from .list_serializers import PrintListSerializer

class CommitteeMemberSerializer(serializers.ModelSerializer):
    envoy_name = serializers.CharField(source='envoy.full_name')
    envoy_id = serializers.IntegerField(source='envoy.id')
    envoy_club = serializers.CharField(source='envoy.club.id')

    class Meta:
        model = CommitteeMember
        fields = ['envoy_id', 'envoy_name', 'envoy_club', 'function']

class CommitteeSittingSerializer(serializers.ModelSerializer):
    prints = PrintListSerializer(many=True)
    
    class Meta:
        model = CommitteeSitting
        fields = ['id', 'agenda', 'closed', 'date', 'num', 'remote', 'video_url', 'pdf_transcript', 'prints']

class CommitteeDetailSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='get_type_display')
    composition_date = serializers.CharField(source='friendlyCompositionDate')
    members = CommitteeMemberSerializer(many=True)
    recent_sittings = CommitteeSittingSerializer(many=True)

    class Meta:
        model = Committee
        fields = ['code', 'name', 'nameGenitive', 'type', 'appointmentDate', 'composition_date', 
                  'phone', 'scope', 'members', 'recent_sittings']

    @classmethod
    def setup_eager_loading(cls, queryset):
        return queryset.prefetch_related(
            Prefetch('members', 
                     queryset=CommitteeMember.objects.select_related('envoy')),
            Prefetch('sittings', 
                     queryset=CommitteeSitting.objects.prefetch_related(
                         Prefetch('prints', 
                                  queryset=PrintModel.objects.only('id', 'title'))
                     ).order_by('-date')[:5],
                     to_attr='recent_sittings')
        )

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['members'] = sorted(ret['members'], key=lambda x: (x['function'] is None, x['function'], x['envoy_name']))
        return ret

