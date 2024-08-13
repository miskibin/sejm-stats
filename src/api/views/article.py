from rest_framework import generics, status
from rest_framework.response import Response

from community_app.models import Article
from community_app.serializers import ArticleSerializer


class ArticleCreateView(generics.CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        print("perform_create", serializer.validated_data)
        # You can add any additional logic here, such as setting the author
        serializer.save()
