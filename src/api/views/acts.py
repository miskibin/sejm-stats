from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import serializers

from eli_app.models import Act


class ActPagination(PageNumberPagination):
	page_size = 100
	page_size_query_param = "page_size"
	max_page_size = 100

class ActSerializer(serializers.ModelSerializer):
	publisher = serializers.StringRelatedField()
	status = serializers.StringRelatedField()
	type = serializers.StringRelatedField()
	releasedBy = serializers.StringRelatedField()
	keywords = serializers.StringRelatedField(many=True)

	class Meta:
		model = Act
		fields = [
			"ELI",
			"address",
			"announcementDate",
			"changeDate",
			"displayAddress",
			"pos",
			"publisher",
			"status",
			"textHTML",
			"textPDF",
			"title",
			"type",
			"volume",
			"year",
			"directives",
			"entryIntoForce",
			"inForce",
			"keywords",
			"releasedBy",
			"url",
		]

class ActViewSet(ReadOnlyModelViewSet):
	pagination_class = ActPagination
	queryset = Act.objects.all()
	serializer_class = ActSerializer