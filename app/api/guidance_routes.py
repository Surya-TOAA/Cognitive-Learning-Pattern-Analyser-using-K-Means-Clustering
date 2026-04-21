from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_db
from app.agents.A4_guidance_generator.service import GuidanceService

router = APIRouter()
a4_service = GuidanceService()

class GuidanceRequest(BaseModel):
    user_id: str

class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    user_id: str
    message: str
    history: Optional[List[ChatMessage]] = None

@router.post("/advice")
def get_advice(request: GuidanceRequest, db: Session = Depends(get_db)):
    return a4_service.get_personalized_advice(db, request.user_id)

@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # Convert ChatMessage objects to dicts for the service
    history_dicts = [m.model_dump() for m in request.history] if request.history else None
    response = a4_service.chat_with_coach(db, request.user_id, request.message, history_dicts)
    return {"response": response}