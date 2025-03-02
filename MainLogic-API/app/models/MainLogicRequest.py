from pydantic import BaseModel
from typing import List

class AnswerSumRequest(BaseModel):
    # name: str
    # id: str
    gender: str
    age: float
    # birth_date: str
    # text_filler_name: str
    # date: str
    pORt: str # p for parent, t for teacher
    kORs: str # kids or school
    answers: List[int]
    
class AnswerSumRuqestWithCred(AnswerSumRequest):
    preprocessed_scores: dict[str, int]
    
# class processrequestDone(AnswerSumRuqestWithCred):
class processrequestDone(BaseModel):
    converted_scores: dict[str, int]