from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from database import verifications_collection, users_collection
from routes.loan_routes import get_current_user_id
from datetime import datetime
import os
from utils.cloudinary_helper import upload_to_cloudinary

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
    bill_file: UploadFile = File(None),    # ✅ Made Optional
    asset_file: UploadFile = File(None),   # ✅ Made Optional
    current_user_id: str = Depends(get_current_user_id)
):
    user = users_collection.find_one({"email": current_user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    bill_image_url = None
    asset_image_url = None

    # 1. Upload bill image to Cloudinary if provided
    if bill_file:
        try:
            bill_image_url = upload_to_cloudinary(bill_file)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Bill upload failed: {str(e)}")

    # 2. Upload asset photo to Cloudinary if provided
    if asset_file:
        try:
            asset_image_url = upload_to_cloudinary(asset_file)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Asset photo upload failed: {str(e)}")

    # Database document structure
    verification_dict = {
        "user_id": current_user_id,
        "loan_id": loan_id,
        "store_name": store_name,
        "bill_number": bill_number,
        "purchase_date": purchase_date,
        "amount_utilized": amount_utilized,
        "description": description,
        "bill_image_path": bill_image_url,   # Will be Cloudinary secure URL or None
        "asset_image_path": asset_image_url, # Will be Cloudinary secure URL or None
        "status": "Pending",
        "submitted_at": datetime.utcnow()
    }
    
    result = verifications_collection.insert_one(verification_dict)
    
    return {
        "message": "Verification submitted successfully with proofs!",
        "submission_id": str(result.inserted_id)
    }


@router.get("/my-submissions")
def get_my_submissions(current_user_id: str = Depends(get_current_user_id)):
    submissions = list(verifications_collection.find({"user_id": current_user_id}))
    
    for sub in submissions:
        sub["_id"] = str(sub["_id"])
        
    return {"submissions": submissions}