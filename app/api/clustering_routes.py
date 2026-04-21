from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.agents.A3_clustering.service import ClusteringService

router = APIRouter()
a3_service = ClusteringService()

class ClusterRequest(BaseModel):
    user_id: str

@router.post("/predict")
def predict_cognitive_pattern(request: ClusterRequest, db: Session = Depends(get_db)):
    result = a3_service.predict_archetype(db, request.user_id)
    return result