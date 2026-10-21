from pydantic import BaseModel, EmailStr

class RegisterModel(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class VerifyOtpModel(BaseModel):
    email: EmailStr
    email_otp: str
    phone_otp: str
    
class LoginModel(BaseModel):
    email: EmailStr
    password: str


