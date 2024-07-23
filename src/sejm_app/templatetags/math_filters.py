from django import template

register = template.Library()


@register.filter
def divide(value):
    return int(value / 1.90)
