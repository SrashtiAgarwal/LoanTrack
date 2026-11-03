from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router
from routes.loan_routes import router as loan_router  # <- Import added
from routes.verification_routes import router as verification_router
from fastapi.staticfiles import StaticFiles
import os
from routes.officer_routes import router as officer_router

app = FastAPI()
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend ka URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(loan_router) 
app.include_router(verification_router)
app.include_router(officer_router)
