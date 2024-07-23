from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

UserModel = get_user_model()


class ActivateAccountView(TemplateView):
    template_name = "accounts/activation/activate_account.html"

    @csrf_exempt
    def get(self, request, uidb64, token, **kwargs):
        context = self.get_context_data(**kwargs)
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if (
            user is not None
            and user.is_active is False
            and default_token_generator.check_token(user, token)
        ):
            user.is_active = True
            user.save()
            context.update({"validlink": True})
        else:
            context.update({"validlink": False})
        return self.render_to_response(context)


class ActivatePleaseView(TemplateView):
    template_name = "accounts/activation/activate_please.html"
