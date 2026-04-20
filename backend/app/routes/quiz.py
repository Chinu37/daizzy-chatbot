from fastapi import APIRouter
from app.models.quiz import SubmitQuiz
from app.services.quiz_service import QuizService

router = APIRouter(prefix="/quiz", tags=["Style Quiz"])
quiz_service = QuizService()

@router.post("/submit")
def submit_quiz(data: SubmitQuiz):
    profile = quiz_service.submit_quiz(data)
    return {"success": True, "message": "Style profile saved", "profile": profile}

@router.get("/profile/{user_id}")
def get_profile(user_id: str):
    profile = quiz_service.get_profile(user_id)
    if not profile:
        return {"success": False, "message": "No style profile found"}
    return {"success": True, "profile": profile}