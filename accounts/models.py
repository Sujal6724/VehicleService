from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from core.models import TimeStampedModel


class Role(TimeStampedModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    """Custom manager for User model with mobile authentication"""
    
    def create_user(self, mobile, password=None, **extra_fields):
        """Create and save a regular user"""
        if not mobile:
            raise ValueError('Mobile number is required')
        
        # Handle email if provided
        email = extra_fields.get('email', '')
        if email:
            extra_fields['email'] = self.normalize_email(email)
        
        user = self.model(mobile=mobile, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, mobile, password=None, **extra_fields):
        """Create and save a superuser"""
        extra_fields.setdefault('role', 'ADMIN')
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)  # You might need to add is_staff field
        
        # Add is_staff to your model if it doesn't exist
        # For now, we'll handle it
        
        if extra_fields.get('role') != 'ADMIN':
            raise ValueError('Superuser must have role=ADMIN')
        
        return self.create_user(mobile, password, **extra_fields)
    
    def get_by_natural_key(self, mobile):
        """Required for authentication - gets user by mobile number"""
        return self.get(mobile=mobile)


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    ROLE_CHOICES = (
        ("CUSTOMER", "Customer"),
        ("PARTNER", "Partner"),
        ("ADMIN", "Admin"),
    )

    full_name = models.CharField(max_length=150)
    mobile = models.CharField(max_length=15, unique=True, db_index=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    # Add is_staff for admin access (required for Django admin)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()  # Add the manager here!

    USERNAME_FIELD = "mobile"
    REQUIRED_FIELDS = ['full_name']  # Add full_name as required for createsuperuser

    def __str__(self):
        return self.mobile
    
    def get_full_name(self):
        return self.full_name
    
    def get_short_name(self):
        return self.full_name.split()[0] if self.full_name else self.mobile


class OTP(TimeStampedModel):
    mobile = models.CharField(max_length=15, db_index=True)
    otp_code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)