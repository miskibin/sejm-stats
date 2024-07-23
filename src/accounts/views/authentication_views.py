from django.conf import settings
from django.contrib import messages
from django.contrib.auth import get_user_model, tokens
from django.contrib.auth import views as auth_views
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.generic import FormView

from accounts.forms import SignInForm, SignUpForm

UserModel = get_user_model()


class SignInView(auth_views.LoginView):
    authentication_form = SignInForm
    template_name = "accounts/signin.html"
    redirect_authenticated_user = True

    def form_valid(self, form):
        remember_me = form.cleaned_data.get("remember_me")
        if remember_me:
            self.request.session.set_expiry(1209600)
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "Wystąpił błąd podczas logowania.")
        return super().form_invalid(form)


class SignUpView(auth_views.RedirectURLMixin, FormView):
    form_class = SignUpForm
    template_name = "accounts/signup.html"
    success_url = reverse_lazy("login")
    next_page = reverse_lazy("home")

    @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    def dispatch(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            redirect_to = self.get_success_url()
            if redirect_to == self.request.path:
                raise ValueError("Redirection loop for authenticated user detected.")
            return HttpResponseRedirect(redirect_to)
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        user = form.save(commit=False)
        if settings.EMAIL_USER_ACTIVATION_REQUIRED:
            user.is_active = False
            user.save()

            self.send_activate_email(user)
            return redirect("please_activate")
        else:
            user.is_active = True
            user.save()

            messages.success(
                self.request, "Konto zostało utworzone. Możesz się teraz zalogować."
            )
            return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "Wystąpił błąd podczas tworzenia konta.")

        return super().form_invalid(form)

    def send_activate_email(self, user):
        current_site = get_current_site(self.request)
        context = {
            "email": user.email,
            "protocol": "https" if self.request.is_secure() else "http",
            "user": user,
            "request": self.request,
            "site_name": current_site.name,
            "domain": current_site.domain,
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": tokens.default_token_generator.make_token(user),
        }

        subject = render_to_string("email/activate_subject.txt", context)
        subject = "".join(subject.splitlines())
        body = render_to_string("email/activate_email.html", context)
        to_email = user.email

        email = EmailMultiAlternatives(subject, body, to=[to_email])
        email.attach_alternative(body, "text/html")
        email.send()


class LogoutView(auth_views.LogoutView):
    next_page = reverse_lazy("home")
