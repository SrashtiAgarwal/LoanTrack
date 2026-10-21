import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)

db = client["LOAN"]
users_collection = db.users
loans_collection = db.loans
verifications_collection=db.verification