from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    # Explicit static path rendering
    path('about/', TemplateView.as_view(template_name="About.html"), name='about'),
    path('contact/', TemplateView.as_view(template_name="Contact.html"), name='contact'),
    path('', TemplateView.as_view(template_name="index.html"), name='index'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)