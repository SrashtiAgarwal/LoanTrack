from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import users_collection, loans_collection, verifications_collection
from routes.loan_routes import get_current_user_id
from models.loan_model import LoanModel
from datetime import datetime
from bson import ObjectId
from utils.security import hash_password
from models.user_model import RegisterModel


router = APIRouter(prefix="/api/officer", tags=["Officer Portal"])

security = HTTPBearer()

# Helper: Check if logged-in user is an Officer
def get_current_officer(current_user_id: str = Depends(get_current_user_id)):
    user = users_collection.find_one({"email": current_user_id})
    if not user or user.get("role") != "Officer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied! Officer privileges required."
        )
    return current_user_id

# 1. Officer Dashboard Stats
@router.get("/dashboard-stats")
def get_officer_stats(officer_id: str = Depends(get_current_officer)):
    total_loans = loans_collection.count_documents({})
    total_beneficiaries = users_collection.count_documents({"role": "Beneficiary"})
    pending_reviews = verifications_collection.count_documents({"status": "Pending"})
    approved_count = verifications_collection.count_documents({"status": "Approved"})
    rejected_count = verifications_collection.count_documents({"status": "Rejected"})

    return {
        "total_loans": total_loans,
        "total_beneficiaries": total_beneficiaries,
        "pending_reviews": pending_reviews,
        "approved_count": approved_count,
        "rejected_count": rejected_count
    }

# 2. Get All Loans (Officer View)
@router.get("/loans")
def get_all_loans(officer_id: str = Depends(get_current_officer)):
    loans = list(loans_collection.find({}))
    for loan in loans:
        loan["_id"] = str(loan["_id"])
        # Fetch user name if available
        user = users_collection.find_one({"email": loan.get("user_id")})
        if user:
            loan["user_name"] = user.get("name")
        else:
            loan["user_name"] = loan.get("user_id")
    return {"loans": loans}

# 3. Sanction / Create New Loan for a Beneficiary
@router.post("/loans")
def create_officer_loan(loan: LoanModel, officer_id: str = Depends(get_current_officer)):
    user = users_collection.find_one({"email": loan.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Beneficiary user with this ID/email does not exist!")
    
    existing_loan = loans_collection.find_one({"loan_id": loan.loan_id})
    if existing_loan:
        raise HTTPException(status_code=400, detail="Loan ID already exists!")
    
    loan_dict = loan.dict()
    result = loans_collection.insert_one(loan_dict)
    
    return {
        "message": "Loan Issued successfully by officer!",
        "loan_id": str(result.inserted_id)
    }

# 4. Get All Beneficiaries
@router.get("/beneficiaries")
def get_all_beneficiaries(officer_id: str = Depends(get_current_officer)):
    beneficiaries = list(users_collection.find({"role": "Beneficiary"}))
    for b in beneficiaries:
        b["_id"] = str(b["_id"])
        b.pop("password", None) # Hide password hash for security
        b.pop("email_otp", None)
        b.pop("otp_expiry", None)
    return {"beneficiaries": beneficiaries}

# 5. Create Beneficiary by officer

@router.post("/beneficiaries", status_code=status.HTTP_201_CREATED)
def register_beneficiary_by_officer(user: RegisterModel, officer_id: str = Depends(get_current_officer)):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered!"
        )
    
    hashed_password = hash_password(user.password)
    
    user_dict = {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "password": hashed_password,
        "is_verified": True,  # Officer dwara add kiya gaya account direct verified rahega
        "role": "Beneficiary"
    }
    
    result = users_collection.insert_one(user_dict)
    
    return {
        "message": "Beneficiary registered successfully by officer!",
        "user_id": str(result.inserted_id)
    }


# 1. Get All Pending Submissions (Audit Queue)
@router.get("/pending-reviews")
def get_pending_reviews(officer_id: str = Depends(get_current_officer)):
    submissions = list(verifications_collection.find({"status": "Pending"}))
    for sub in submissions:
        sub["_id"] = str(sub["_id"])
        # Fetch user details for display
        user = users_collection.find_one({"email": sub.get("user_id")})
        if user:
            sub["user_name"] = user.get("name")
            sub["user_phone"] = user.get("phone")
        else:
            sub["user_name"] = sub.get("user_id")
            sub["user_phone"] = "N/A"
    return {"submissions": submissions}

# 2. Update Verification Status (Approve / Reject)
# 2. Update Verification Status (Approve / Reject with Remark)
@router.post("/verification-action/{sub_id}")
def update_verification_status(sub_id: str, action_data: dict, officer_email: str = Depends(get_current_officer)):
    new_status = action_data.get("status")
    remark = action_data.get("remark", "")
    
    if new_status not in ["Approved", "Rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status action!")

    try:
        object_id = ObjectId(sub_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid submission ID format!")

    # 🔍 Officer ka email/ID se unka real Name nikalna
    officer_user = users_collection.find_one({"email": officer_email})
    officer_name = officer_user.get("name") if officer_user else officer_email

    result = verifications_collection.update_one(
        {"_id": object_id},
        {
            "$set": {
                "status": new_status, 
                "reviewed_by": officer_name,  # 👈 Ab yahan email ki jagah officer ka naam save hoga!
                "reviewed_at": datetime.utcnow(),
                "officer_remark": remark
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found!")

    return {"message": f"Verification application successfully {new_status.lower()}!"}
# Get All Verified (Approved) Applications
@router.get("/verified-applications")
def get_verified_applications(officer_id: str = Depends(get_current_officer)):
    submissions = list(verifications_collection.find({"status": "Approved"}))
    for sub in submissions:
        sub["_id"] = str(sub["_id"])
        # Fetch user details for display
        user = users_collection.find_one({"email": sub.get("user_id")})
        if user:
            sub["user_name"] = user.get("name")
            sub["user_phone"] = user.get("phone")
        else:
            sub["user_name"] = sub.get("user_id")
            sub["user_phone"] = "N/A"
    return {"submissions": submissions}

# Get All Rejected Applications
@router.get("/rejected-applications")
def get_rejected_applications(officer_id: str = Depends(get_current_officer)):
    submissions = list(verifications_collection.find({"status": "Rejected"}))
    for sub in submissions:
        sub["_id"] = str(sub["_id"])
        # Fetch user details for display
        user = users_collection.find_one({"email": sub.get("user_id")})
        if user:
            sub["user_name"] = user.get("name")
            sub["user_phone"] = user.get("phone")
        else:
            sub["user_name"] = sub.get("user_id")
            sub["user_phone"] = "N/A"
    return {"submissions": submissions}