from django.urls import path

from accounts.views import *

urlpatterns = [
    # authentication
    path("login/", SignInView.as_view(), name="login"),
    path("register/", SignUpView.as_view(), name="register"),
    path("logout/", LogoutView.as_view(), name="logout"),
    # password reset
    path("password-reset/", PasswordResetView.as_view(), name="password-reset"),
    path(
        "password-reset-done/",
        PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "password-reset-confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "password-reset-complete/",
        PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    # account activation
    path("please-activate/", ActivatePleaseView.as_view(), name="please_activate"),
    path(
        "activate/<uidb64>/<token>/",
        ActivateAccountView.as_view(),
        name="activate_account",
    ),
    # account panel
    path("profile/", ProfileView.as_view(), name="profile"),
    path("change-password/", PasswordChangeView.as_view(), name="change_password"),
    # articles
    path("articles/", ArticleListView.as_view(), name="article_list"),
    path("articles/create/", ArticleCreateView.as_view(), name="article_create"),
    path("articles/<slug>/delete/", ArticleDeleteView.as_view(), name="article_delete"),
    path("articles/<slug>/edit/", ArticleUpdateView.as_view(), name="article_edit"),
    path(
        "articles/<slug>/preview/", ArticleDetailView.as_view(), name="article_preview"
    ),
]
