from fastapi import FastAPI, Depends, HTTPException, Header
import uvicorn
from routers.omrRoute import omrRouter
import os
from dotenv import load_dotenv 
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Allow requests from any origin (or specify only your frontend origin)
origins = [
    "http://localhost:5173",  # Your frontend URL
]

# Enable CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,
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

app.include_router(omrRouter, prefix="/api/v1/omr", tags=["OMR"], dependencies=[Depends(validate_api_key)])

@app.get("/")
def read_root():
    return {"message": "Welcome to the DIASCORE-OMR FastAPI application"}

if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1", port=8001)
