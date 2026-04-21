from pydantic import BaseModel
from typing import Optional

class QuizRequest(BaseModel):
    user_id: str
    subject: str
    accuracy: Optional[float] = None
    improvement: Optional[float] = None
    archetype: Optional[str] = None