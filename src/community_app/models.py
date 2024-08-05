import html
from datetime import datetime

from ckeditor.fields import RichTextField
from django.conf import settings
from django.db import models
from django.template.defaultfilters import safe, slugify
from django.urls import reverse
from django.utils.functional import cached_property
from django.utils.html import strip_tags
from django.utils.translation import gettext_lazy as _
from meta.models import ModelMeta

from sejm_app.models import Club, Envoy


class ArticleManager(models.Manager):
    def published(self):
        return self.filter(status=Article.Status.PUBLISHED).order_by("-published_at")

    def drafts(self):
        return self.filter(status=Article.Status.DRAFT)

    def waiting_for_approve(self):
        return self.filter(status=Article.Status.WAITING_FOR_APPROVE)

    def declined(self):
        return self.filter(status=Article.Status.DECLINED)

    def archived(self):
        return self.filter(status=Article.Status.ARCHIVED)


def image_upload_to(article_instance, filename):
    return f"attachments/{datetime.now().year}/{article_instance.slug}/{filename}"


class Article(ModelMeta, models.Model):
    class Status(models.IntegerChoices):
        DRAFT = 0, "Draft"
        WAITING_FOR_APPROVE = 1, "Waiting for approval"
        PUBLISHED = 2, "Published"
        DECLINED = 3, "Declined"
        ARCHIVED = 4, "Archived"

    title = models.CharField(_("title"), max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    content = RichTextField(_("body"), blank=True)
    image = models.ImageField(upload_to=image_upload_to, max_length=255)
    status = models.IntegerField(choices=Status, default=Status.DRAFT)

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, blank=False, null=False, on_delete=models.CASCADE
    )
    clubs = models.ManyToManyField(Club, blank=True, null=True)
    envoys = models.ManyToManyField(Envoy, blank=True, null=True)
    related_articles = models.ManyToManyField("self", blank=True)

    is_important = models.BooleanField(default=False)
    tags = models.ManyToManyField(
        "ArticleTag", help_text=_("Tags that describe this article"), blank=True
    )
    category = models.ForeignKey(
        "ArticleCategory",
        verbose_name=_("category"),
        blank=True,
        null=True,
        on_delete=models.CASCADE,
    )

    views = models.PositiveIntegerField(_("views"), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)

    objects = ArticleManager()
    _metadata = {
        "title": "get_title",
        "description": "description",
        "image": "get_meta_image",
    }

    def get_title(self):
        return f"{self.title} - Sejm Stats"

    def get_meta_image(self):
        if self.image:
            return self.image.url

    @cached_property
    def content_to_text(self):
        return safe(strip_tags(html.unescape(self.content)))

    @cached_property
    def description(self):
        return self.content_to_text[:120]

    @property
    def image_url(self):
        return self.image.url

    def publish(self):
        self.status = self.Status.WAITING_FOR_APPROVE
        self.save()

    def approve(self):
        self.status = self.Status.PUBLISHED
        self.save()

    def decline(self):
        self.status = self.Status.DECLINED
        self.save()

    def archive(self):
        self.status = self.Status.ARCHIVED
        self.save()

    def viewed(self):
        self.views += 1
        self.save()

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        if self.status == self.Status.PUBLISHED and not self.published_at:
            self.published_at = datetime.now()

        super(Article, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("article_detail", kwargs={"slug": self.slug})

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("article")
        verbose_name_plural = _("articles")
        get_latest_by = "id"


class ArticleCategory(models.Model):
    name = models.CharField(_("category name"), max_length=30, unique=True, blank=True)
    slug = models.SlugField(max_length=30, unique=True, blank=True, null=True)
    parent_category = models.ForeignKey(
        "self",
        verbose_name=_("parent category"),
        blank=True,
        null=True,
        on_delete=models.CASCADE,
    )
    index = models.IntegerField(default=0, verbose_name=_("index"))

    class Meta:
        ordering = ["-index"]
        verbose_name = _("category")
        verbose_name_plural = verbose_name

    def get_absolute_url(self):
        pass

    def __str__(self):
        return self.name

    def get_category_tree(self):
        categories = []

        def parse(category):
            categories.append(category)
            if category.parent_category:
                parse(category.parent_category)

        parse(self)
        return categories

    def get_sub_categories(self):
        categories = []
        all_categories = ArticleCategory.objects.all()

        def parse(category):
            if category not in categories:
                categories.append(category)
            children = all_categories.filter(parent_category=category)
            for child in children:
                if category not in categories:
                    categories.append(child)
                parse(child)

        parse(self)
        return categories

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(ArticleCategory, self).save(*args, **kwargs)


class ArticleTag(models.Model):
    name = models.CharField(max_length=30, unique=True, blank=True)
    slug = models.SlugField(max_length=30, unique=True, blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(ArticleTag, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("tag_detail", kwargs={"tag_name": self.slug})

    def get_article_count(self):
        return Article.objects.filter(tags__name=self.name).distinct().count()

    class Meta:
        ordering = ["name"]
        verbose_name = _("tag")
        verbose_name_plural = verbose_name


class TeamMember(models.Model):
    class Role(models.IntegerChoices):
        CREATOR = 0, _("Twórca aplikacji")
        DEVELOPER = 1, _("Programista")
        SUPPORTER = 2, _("Wyjątkowo chojny wspierający")
        SUPPORTER_SMALL = 3, _("Wspierający")

    # badge = models.CharField(max_length=10, null=True, blank=True)
    name = models.CharField(max_length=64)
    role = models.IntegerField(choices=Role.choices, default=Role.SUPPORTER_SMALL)
    since = models.CharField(max_length=7, default="YYYY-MM")
    facebook_url = models.URLField(null=True, blank=True)
    # linkedin_url = models.URLField(null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    photo = models.ImageField(upload_to="photos", null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} - {self.role}"

    class Meta:
        ordering = ["-role"]
