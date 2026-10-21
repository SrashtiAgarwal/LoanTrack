from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.loan_model import LoanModel
from database import users_collection, loans_collection
import os
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"

router = APIRouter(prefix="/api/loans", tags=["Loans"])

# Yeh line Swagger UI mein lock icon (Authorize button) le aayegi!
security = HTTPBearer()
def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub") or payload.get("email") 
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Could not validate credentials")

@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_loan(loan: LoanModel):
    user = users_collection.find_one({"email": loan.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Beneficiary user with this ID/email does not exist!")
    
    existing_loan = loans_collection.find_one({"loan_id": loan.loan_id})
    if existing_loan:
        raise HTTPException(status_code=400, detail="Loan ID already exists!")
    
    loan_dict = loan.dict()
    result = loans_collection.insert_one(loan_dict)
    
    return {
        "message": "Loan created successfully!",
        "loan_id": str(result.inserted_id)
    }

@router.get("/my-loans")
def get_user_loans(current_user_id: str = Depends(get_current_user_id)):
    loans = list(loans_collection.find({"user_id": current_user_id}))
    
    for loan in loans:
        loan["_id"] = str(loan["_id"])
        
    return {"loans": loans}