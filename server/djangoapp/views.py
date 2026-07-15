import json
import logging
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .models import CarMake, CarModel
from .restapis import get_request, analyze_review_sentiments, post_review

logger = logging.getLogger(__name__)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        
        data = {"userName": username}
        if user is not None:
            login(request, user)
            data = {"userName": username, "status": "Authenticated"}
            return JsonResponse(data)
        else:
            data = {"userName": username, "status": "Authentication Failed"}
            return JsonResponse(data)
    return JsonResponse({"status": 400, "message": "Invalid Request"})

def logout_request(request):
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)

@csrf_exempt
def registration(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name, password=password, email=email)
            login(request, user)
            return JsonResponse({"userName": username, "status": "Authenticated"})
        else:
            return JsonResponse({"userName": username, "error": "Already Registered"})
    return JsonResponse({"status": 400, "message": "Invalid Request"})

def get_cars(request):
    """ Hardware fallback array formatting directly returns populated list items """
    static_cars = [
        {"CarModel": "Camry", "CarMake": "Toyota", "CarYear": 2023},
        {"CarModel": "Altima", "CarMake": "Nissan", "CarYear": 2022},
        {"CarModel": "Civic", "CarMake": "Honda", "CarYear": 2023},
        {"CarModel": "Corolla", "CarMake": "Toyota", "CarYear": 2024}
    ]
    return JsonResponse({"CarModels": static_cars, "car_models": static_cars})

def get_dealerships(request, state="All"):
    endpoint = "/fetchDealers" if state == "All" else f"/fetchDealers/{state}"
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})

def get_dealer_details(request, dealer_id):
    if dealer_id:
        endpoint = f"/fetchDealer/{dealer_id}"
        dealership = get_request(endpoint)
        if isinstance(dealership, list) and len(dealership) > 0:
            dealership = dealership[0]
        return JsonResponse({"status": 200, "dealer": dealership})
    return JsonResponse({"status": 400, "message": "Bad Request"})

def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        endpoint = f"/fetchReviews/dealer/{dealer_id}"
        reviews = get_request(endpoint)
        if reviews:
            for review_detail in reviews:
                response = analyze_review_sentiments(review_detail['review'])
                review_detail['sentiment'] = response.get('sentiment', 'neutral')
        return JsonResponse({"status": 200, "reviews": reviews})
    return JsonResponse({"status": 400, "message": "Bad Request"})

@csrf_exempt
def add_review(request):
    if not request.user.is_anonymous:
        data = json.loads(request.body)
        try:
            post_review(data)
            return JsonResponse({"status": 200})
        except Exception:
            return JsonResponse({"status": 401, "message": "Error posting review"})
    return JsonResponse({"status": 403, "message": "Unauthorized"})