from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status
from models.user_model import RegisterModel, LoginModel, VerifyOtpModel
from database import users_collection
from utils.security import hash_password, verify_password
from utils.email import send_otp_email
from utils.sms import send_otp, verify_otp
import random
import os
from jose import jwt
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")  # Ensure karo .env file mein SECRET_KEY ho
ALGORITHM = "HS256"

router = APIRouter(prefix="/api", tags=["Auth"])

@router.post("/register")
def register_user(user: RegisterModel):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user and existing_user.get("is_verified", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered and verified!"
        )
    
    email_otp = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(minutes=5)

    hashed_password = hash_password(user.password)
    
    user_dict = {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "password": hashed_password,
        "email_otp": email_otp,
        "otp_expiry": expiry,
        "is_verified": False,
        "role":"Beneficiary"
    }
    
    users_collection.update_one(
        {"email": user.email},
        {"$set": user_dict},
        upsert=True
    )
    
    # 1. Email OTP bhejna
    email_sent = False
    try:
        email_sent = send_otp_email(user.email, email_otp)
    except Exception as e:
        print("Email sending exception:", e)

    # 2. SMS OTP bhejna
    sms_sent = False
    try:
        sms_result = send_otp(user.phone)
        sms_sent = sms_result.get("success", False)
    except Exception as e:
        print("SMS sending exception:", e)

    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP to email!"
        )
    
    if not sms_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP to phone number!"
        )

    return {"message": "OTP sent successfully to your email and phone number!"}

@router.post("/verify-otp")
def verify_user_otp(data: VerifyOtpModel):
    db_user = users_collection.find_one({"email": data.email})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found!"
        )
    
    if db_user.get("is_verified"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already verified!"
        )
    
    if datetime.utcnow() > db_user.get("otp_expiry"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired!"
        )
    
    if db_user.get("email_otp") != data.email_otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Email OTP!"
        )
    
    try:
        phone_check = verify_otp(db_user["phone"], data.phone_otp)
        if not phone_check.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Phone OTP!"
            )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Phone OTP verification error: {str(e)}"
        )
    
    users_collection.update_one(
        {"email": data.email},
        {
            "$set": {"is_verified": True},
            "$unset": {"email_otp": "", "otp_expiry": ""}
        }
    )

    return {"message": "Account verified successfully!"}

@router.post("/login")
def login_user(user: LoginModel):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password!"
        )
    
    if not db_user.get("is_verified", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please verify your account with OTP first!"
        )
    
    is_valid = verify_password(user.password, db_user["password"])
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password!"
        )
    
    # --- JWT Token Generation ---
    payload = {"sub": db_user["email"]}
    access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "message": "Login successful!",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": db_user["name"],
            "email": db_user["email"],
            "role": db_user["role"]

        }
    }