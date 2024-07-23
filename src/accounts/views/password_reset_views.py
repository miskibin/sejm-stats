from django.contrib.auth import get_user_model
from django.contrib.auth import views as auth_views
from django.urls import reverse_lazy

from accounts.forms import PasswordResetConfirmForm, PasswordResetForm

UserModel = get_user_model()


class PasswordResetView(auth_views.PasswordResetView):
    form_class = PasswordResetForm
    template_name = "accounts/password_reset/password_reset.html"
    email_template_name = "email/password_reset_email.html"
    html_email_template_name = "email/password_reset_email.html"
    subject_template_name = "email/password_reset_subject.txt"
    success_url = reverse_lazy("password_reset_done")


class PasswordResetDoneView(auth_views.PasswordResetDoneView):
    template_name = "accounts/password_reset/password_reset_done.html"


class PasswordResetConfirmView(auth_views.PasswordResetConfirmView):
    form_class = PasswordResetConfirmForm
    template_name = "accounts/password_reset/password_reset_confirm.html"


class PasswordResetCompleteView(auth_views.PasswordResetCompleteView):
    template_name = "accounts/password_reset/password_reset_complete.html"
