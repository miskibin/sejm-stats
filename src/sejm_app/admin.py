from django.contrib import admin

from sejm_app.models import (FAQ, AdditionalPrint, Club, ClubVote,
                             CommitteeSitting, Envoy, Interpellation,
                             PrintModel, Process, Reply, Scandal, Stage, Vote,
                             Voting)
from sejm_app.models.committee import Committee, CommitteeMember
from sejm_app.models.vote import ListVote
from sejm_app.models.voting import VotingOption


class CommitteeMemberInline(admin.TabularInline):
    model = CommitteeMember
    extra = 1  # defines the number of extra forms displayed at the bottom of the table


class CommitteeSittingInline(admin.TabularInline):
    model = CommitteeSitting
    extra = 1


@admin.register(Committee)
class CommitteeAdmin(admin.ModelAdmin):
    list_display = ("name",)

    inlines = [CommitteeMemberInline, CommitteeSittingInline]


@admin.register(ClubVote)
class ClubVoteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "club",
    )


@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ("id", "key")


@admin.register(Interpellation)
class InterpellationAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "fromMember")


class StageInline(admin.TabularInline):
    model = Stage
    extra = 1  # defines the number of extra forms displayed at the bottom of the table


@admin.register(Process)
class ProcessAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
    )
    inlines = [
        StageInline,
    ]


@admin.register(PrintModel)
class PrintModelAdmin(admin.ModelAdmin):
    list_display = ("id", "number", "title")


@admin.register(AdditionalPrint)
class AdditionalPrintAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "number",
        "title",
    )


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("id", "question")


@admin.register(Scandal)
class ScandalAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if not obj.pk:  # if this is a new object, set the author
            obj.author = request.user
        super().save_model(request, obj, form, change)


class ListVoteInline(admin.TabularInline):
    model = ListVote
    extra = 1


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("id",)
    inlines = [ListVoteInline]


@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "fax", "email")


class VotingOptionInline(admin.TabularInline):
    model = VotingOption
    extra = 1


@admin.register(Voting)
class VotingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "topic",
        "category",
    )
    list_filter = ("kind", "category")
    inlines = [VotingOptionInline]


@admin.register(Envoy)
class EnvoyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "firstName",
        "secondName",
        "lastName",
    )
