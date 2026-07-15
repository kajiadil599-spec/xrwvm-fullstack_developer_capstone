from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    # You can add additional fields here if desired (e.g., country_of_origin)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)  # Many-to-One relationship
    dealer_id = models.IntegerField()  # Refers to a dealer in Cloudant database
    name = models.CharField(max_length=100)
    
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        ('COUPE', 'Coupe'),
        ('HATCHBACK', 'Hatchback'),
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default='SUV')
    
    # Allows a wider range of realistic years up to 2026
    year = models.IntegerField(
        default=2026,
        validators=[
            MaxValueValidator(2026),
            MinValueValidator(2015)
        ]
    )

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"