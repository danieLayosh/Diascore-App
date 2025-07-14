from fastapi import FastAPI, Depends, HTTPException, Header
import uvicorn
from app.routers.questions import router_questions
import os
from dotenv import load_dotenv 
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Allow requests from any origin (or specify only your frontend origin)
origins = [
    "http://localhost:2286",
    "http://localhost",
    "http://127.0.0.1",
    "https://diascore.layco.tech",
    "https://diascore-backend.layco.tech"
]

# Enable CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Read API Key from environment
API_KEY = os.getenv("API_KEY")  

# Function to validate API Key
def validate_api_key(x_api_key: str =Header(None)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return True

# app.include_router(router_questions, dependencies=[Depends(validate_api_key)])
app.include_router(router_questions)

@app.get("/")
def read_root():
    return {"message": "Welcome to the DIASCORE-BACKEND FastAPI application"}

@app.get("/test-cors")
def test():
    return {"cors": "ok"}

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=2290)
