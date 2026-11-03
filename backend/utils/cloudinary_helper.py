import os
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from dotenv import load_dotenv

load_dotenv()

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_to_cloudinary(file: UploadFile) -> str:
    try:
        # File read karein aur Cloudinary par upload kar dein
        contents = file.file.read()
        response = cloudinary.uploader.upload(
            contents,
            folder="loan_utilization_proofs"  # Cloudinary ke andar folder ka naam
        )
        # Secure URL return karega jo DB mein save hoga
        return response.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")