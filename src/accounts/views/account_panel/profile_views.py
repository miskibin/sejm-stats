from django.contrib import messages
from django.contrib.auth import views as auth_views
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import UpdateView

from accounts.forms import ProfileForm
from accounts.forms.profile_forms import PasswordChangeForm


class ProfileView(LoginRequiredMixin, UpdateView):
    template_name = "account_panel/profile.html"
    form_class = ProfileForm

    def get_object(self, queryset=None):
        return self.request.user.get_profile()


class PasswordChangeView(LoginRequiredMixin, auth_views.PasswordChangeView):
    form_class = PasswordChangeForm
    template_name = "account_panel/change_password.html"
    success_url = reverse_lazy("change_password")

    def form_valid(self, form):
        form.save()
        messages.success(self.request, "Hasło zostało zmienione.")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(
            self.request, "Wystąpił błąd podczas zmiany hasła. Spróbuj ponownie."
        )
        return super().form_invalid(form)
