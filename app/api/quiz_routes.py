from fastapi import APIRouter
from app.schemas.quiz_schema import QuizRequest
from app.agents.A1_quiz_generator.adaptive_logic import determine_difficulty
from app.agents.A1_quiz_generator.llm_client import generate_full_quiz

router = APIRouter()

@router.post("/generate")
def generate_quiz(request: QuizRequest):
    performance_data = {
        "accuracy": request.accuracy,
        "improvement": request.improvement
    }

    difficulty_profile = determine_difficulty(performance_data)

    quiz = generate_full_quiz(
        subject=request.subject,
        difficulty_profile=difficulty_profile
    )

    return {
        "user_id": request.user_id,
        "difficulty_profile": difficulty_profile,
        "quiz": quiz
    }