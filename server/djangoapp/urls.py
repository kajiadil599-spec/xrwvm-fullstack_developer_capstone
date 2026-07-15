from django.urls import path
from . import views

app_name = 'djangoapp'
urlpatterns = [
    path('', view=views.get_dealerships, name='index'),
    path('login', view=views.login_user, name='login'),
    path('logout', view=views.logout_request, name='logout'),
    path('register', view=views.registration, name='register'),
    path('get_cars', view=views.get_cars, name='getcars'),
    path('get_dealers', view=views.get_dealerships, name='get_dealers'),
    path('get_dealers/<str:state>', view=views.get_dealerships, name='get_dealers_by_state'),
    path('dealer/<int:dealer_id>', view=views.get_dealer_details, name='dealer_details'),
    path('reviews/dealer/<int:dealer_id>', view=views.get_dealer_reviews, name='dealer_reviews'),
    path('add_review', view=views.add_review, name='add_review'),
]