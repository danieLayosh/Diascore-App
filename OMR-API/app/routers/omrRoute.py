from fastapi import APIRouter, HTTPException, UploadFile, Form, File
from app.models.omrModels import OMRResponse
from app.services.omr import do_omr_two_pages, read_image
from typing import List

omrRouter = APIRouter()

@omrRouter.post(path="/process-omr", response_model=OMRResponse)
async def process_omr(
    files: List[UploadFile] = File(...),
    pORt: str = Form(...),  # Expecting "p" for parent, "t" for teacher
    kORs: str = Form(...)   # Expecting "kids" or "school"
) -> dict[str, dict[int, int]]:
    try:
        # Convert each uploaded file into an image
        images = [read_image(file) for file in files]
        # Call the OMR function with the list of images
        answers = do_omr_two_pages(images)
        sorted_answers = {k: answers[k] for k in sorted(answers)}
        return {"answers": sorted_answers}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")