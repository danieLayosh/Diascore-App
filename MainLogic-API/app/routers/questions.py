from fastapi import APIRouter
from models.MainLogicRequest import AnswerSumRequest, AnswerSumRuqestWithCred, processrequestDone
from services.check_questions.kids import check_questions as check_kids
from services.check_questions.school import check_questions as check_school
from services.excel_service import process_all_scores
from services.validate_request import validate_request_params
import services.questions_list as questions_list

router_questions = APIRouter()

@router_questions.post("/questions/sum/")
async def calculate_answers(request: AnswerSumRequest) -> processrequestDone:
    # request param validation
    validate_request_params(request)
        
    # Creating the AnswerRequest instance and populating 
    result = AnswerSumRuqestWithCred(
        **request.model_dump(),
        preprocessed_scores=check_kids(request.answers) if request.kORs == "kids" else check_school(request.answers, request.pORt)
    )

    return process_all_scores(result)

@router_questions.get("/questions/body/")
async def get_request_body():
    return AnswerSumRequest.schema_json().split()


@router_questions.get("/questions/test/")
async def get_questions_test(pORt: str, kORs: str) -> list[str]:
    return questions_list.get_questions_list(pORt=pORt, kORs=kORs)
        