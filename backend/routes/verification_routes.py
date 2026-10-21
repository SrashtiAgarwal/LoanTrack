from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from database import verifications_collection, users_collection
from routes.loan_routes import get_current_user_id
from datetime import datetime
import shutil
import os

router = APIRouter(prefix="/api/verification", tags=["Verification"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_verification(
    loan_id: str = Form(...),
    store_name: str = Form(...),
    bill_number: str = Form(...),
    purchase_date: str = Form(...),
    amount_utilized: float = Form(...),
    description: str = Form(None),
    bill_file: UploadFile = File(...),
    asset_file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user_id)
):
    user = users_collection.find_one({"email": current_user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Files ko server par save karna (Aage AI / OCR processing ke liye)
    bill_path = os.path.join(UPLOAD_DIR, bill_file.filename)
    with open(bill_path, "wb") as buffer:
        shutil.copyfileobj(bill_file.file, buffer)
        
    asset_path = os.path.join(UPLOAD_DIR, asset_file.filename)
    with open(asset_path, "wb") as buffer:
        shutil.copyfileobj(asset_file.file, buffer)

    # Database document structure
    verification_dict = {
        "user_id": current_user_id,
        "loan_id": loan_id,
        "store_name": store_name,
        "bill_number": bill_number,
        "purchase_date": purchase_date,
        "amount_utilized": amount_utilized,
        "description": description,
        "bill_image_path": bill_path,
        "asset_image_path": asset_path,
        "status": "Pending",
        "submitted_at": datetime.now()
    }
    
    result = verifications_collection.insert_one(verification_dict)
    
    return {
        "message": "Verification submitted successfully with proofs!",
        "submission_id": str(result.inserted_id)
    }