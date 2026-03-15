# Task: Generate Tokens for Postman API Testing
Status: In Progress

## Steps to Complete:
- [✓] 1. Add LoginSerializer to accounts/serializers.py
- [✓] 2. Add LoginAPIView to accounts/views.py
- [✓] 3. Update accounts/urls.py to include login path and routers
- [✓] 4. Update vehicleservice/urls.py to include accounts urls at api/accounts/
- [✓] 5. Fixed accounts/views.py (removed invalid partner models) and run migrations
- [✓] 6. Created superuser (use your mobile: 9777315605, password: harapriya123 for login)
- [ ] 7. Run python manage.py runserver
- [✓] 8. Create Postman collection vehicles-api.postman_collection.json
- [✓] Fixed partners/views.py (added serializer_class)
- [ ] ✓ 9. Test: POST http://127.0.0.1:8000/api/accounts/login/ {"mobile": "1234567890", "password": "testpass123"} -> copy token
- [ ] 10. Use token in Postman for /api/vehicles/, /api/bookings/ etc. with header Authorization: Token <token>

## Previous TODOs (VehicleService)
Status: Completed
