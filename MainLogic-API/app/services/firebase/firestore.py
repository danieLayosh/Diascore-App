import os
from dotenv import load_dotenv 
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import firestore

load_dotenv()

# Get the Firestore credentials path
cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
print("Firestore credentials path:", cred_path)

# Initialize Firestore
db = firestore.Client.from_service_account_json(cred_path)


def get_diagnostic_by_uid(collection: str, uid: str) -> dict:
    """Get the diagnostic data from Firestore based on the collection and UID."""
    doc_ref = db.collection(collection).document(uid)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return {"error": "Document not found"}
    

def upload_diagnostic_answers_from_link(linkId, answers):
    """Upload the diagnostic answers to Firestore based on the linkId."""
    # Fetch the link document
    link_doc_ref = db.collection("Links").document(linkId)
    link_doc = link_doc_ref.get()

    if not link_doc.exists:
        return {"error": "Link not found"}

    link_data = link_doc.to_dict()
    diagnosisId = link_data.get("diagnosisId")
    userId = link_data.get("userId")

    if not diagnosisId or not userId:
        return {"error": "Missing userId or diagnosisId in link"}

    if not answers:
        return {"error": "Answers not provided"}

    # Check if all answers are submitted
    # if len(answers) < 63:
    #     return {"error": "All answers not submitted"}

    # Get reference to the user's diagnosis document inside the Diagnoses sub-collection
    diagnosis_doc_ref = db.collection("Users").document(userId).collection("Diagnoses").document(diagnosisId)

    # Check if the diagnosis document exists
    diagnosis_doc = diagnosis_doc_ref.get()
    if not diagnosis_doc.exists:
        return {"error": "Diagnosis document not found"}

    # Update the diagnosis document with answers
    diagnosis_doc_ref.update({"answers": answers})

    return {"message": "Answers uploaded successfully"}