from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class LoanModel(BaseModel):
    user_id: str             
    loan_id: str        
    purpose: str             
    amount: float         
    status: str = "Active"       
    tenure_months: int
    interest_rate: Optional[float] = None
    remaining_balance: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.now)
  