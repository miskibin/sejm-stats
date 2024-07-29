from rest_framework.pagination import PageNumberPagination


class ApiViewPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = "page_size"
    max_page_size = 4000
