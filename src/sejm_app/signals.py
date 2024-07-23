# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from sejm_app.models import AggregatedModel, Envoy, Process, Interpellation, Vote
# from django.db import models


# @receiver(post_save, sender=Envoy)
# def update_max_total_activity(sender, instance, **kwargs):
#     max_total_activity = AggregatedModel.objects.first()
#     max_activity = Envoy.objects.aggregate(max_activity=models.Max("total_activity"))[
#         "total_activity"
#     ]
#     if max_total_activity is None:
#         max_total_activity = AggregatedModel.objects.create(
#             max_total_activity=instance.total_activity
#         )
#     else:
#         max_total_activity.max_total_activity = max(
#             max_total_activity.max_total_activity, instance.total_activity
#         )
#         max_total_activity.save()
