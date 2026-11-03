from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class VerificationModel(BaseModel):
    loan_id: str 
    store_name: str
    bill_number: str 
    purchase_date: str 
    amount_utilized: float 
    description: Optional[str] = None 
    status: str = "Pending"
    submitted_at: datetime = Field(default_factory=datetime.now)
    officer_comments: Optional[str] = None
    