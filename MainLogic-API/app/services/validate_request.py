from fastapi import HTTPException
from models.MainLogicRequest import AnswerSumRequest
from pydantic import ValidationError

def validate_request_params(request: AnswerSumRequest) -> bool:
    
    # # Check if name is not empty
    # if not request.name:
    #     raise HTTPException(status_code=400, detail="Name is required")
    
    # # Check if id is not 9 digits
    # if len(request.id) != 9:
    #     raise HTTPException(status_code=400, detail="ID must be 9 digits")
    
    # Check if gender is, girl or boy
    if request.gender.lower() not in ["boy", "girl"]:
        raise HTTPException(status_code=400, detail="Invalid gender specified, nust be a 'boy' or 'girl'")
        
    # Check if age is between 2 and 18
    if request.age < 2.0 or request.age >= 19.0:
        raise HTTPException(status_code=400, detail="Age not supported, must be between 2 and 18")

    # # Check if birth_date is in the correct format
    # if len(request.birth_date) != 10:
    #     raise HTTPException(status_code=400, detail="Birth date must be in the format 'YYYY-MM-DD'")
    
    # # Check if text_filler_name is not empty
    # if not request.text_filler_name:
    #     raise HTTPException(status_code=400, detail="Text filler name is required")
    
    # # Check if date is in the correct format
    # if len(request.date) != 10:
    #     raise HTTPException(status_code=400, detail="Date must be in the format 'YYYY-MM-DD'")
    
    # Check if pORt is 'p' or 't'
    if request.pORt.lower() not in ["p", "t"]:
        raise HTTPException(status_code=400, detail="Invalid pORt specified, must be 'p' or 't'")
    
    # Check if kORs is 'kids' or 'school'
    if request.kORs.lower() not in ["kids", "school"]:
        raise HTTPException(status_code=400, detail="Invalid kORs specified, must be 'kids' or 'school'")
    
    # Check if answers is not empty
    if not request.answers:
        raise HTTPException(status_code=400, detail="Answers are required")
    
    # Check if answers is a list with 63 or 86 elements
    if len(request.answers) not in [63, 86]:
        raise HTTPException(status_code=400, detail="Answers must be a list of 63 or 86 integers depending on the test")
    
    # Check if all scores are either 1, 2, or 3
    if not all(score in [1, 2, 3] for score in request.answers):
        raise HTTPException(status_code=400, detail="All scores must be 1, 2, or 3")
    
    return True