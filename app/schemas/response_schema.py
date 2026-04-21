from pydantic import BaseModel
from typing import List

class TechResponse(BaseModel):
    difficulty: str
    is_correct: bool
    response_time_seconds: float

class CharResponse(BaseModel):
    impulsiveness: int
    patience: int
    focus: int
    reflection: int
    risk_taking: int

class QuizSubmission(BaseModel):
    user_id: str
    subject: str
    technical_answers: List[TechResponse]
    characteristic_answers: List[CharResponse]