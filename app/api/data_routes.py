from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.response_schema import QuizSubmission
from app.agents.A2_data_collector.service import DataCollectorService

router = APIRouter()
a2_service = DataCollectorService()

@router.post("/submit")
def submit_quiz(submission: QuizSubmission, db: Session = Depends(get_db)):
    
    features = a2_service.process_submission(db, submission)
    
    return {
        "message": "Data successfully stored and features extracted! 🚀", 
        "user_id": features.user_id,
        "extracted_overall_accuracy": features.accuracy_overall,
        "carelessness_rate": features.carelessness_rate
    }

@router.get("/reports/{user_id}")
def get_user_reports(user_id: str, db: Session = Depends(get_db)):
    from app.models.db_models import ExtractedFeatures
    reports = db.query(ExtractedFeatures).filter(ExtractedFeatures.user_id == user_id).all()
    
    if not reports:
        return {"message": "No data found for this user.", "data": []}
    
    # Transform into a format easy for charts
    formatted_data = []
    for r in reports:
        formatted_data.append({
            "id": r.id,
            "accuracy": r.accuracy_overall,
            "carelessness": r.carelessness_rate,
            "response_time": r.avg_response_time,
            "impulsiveness": r.impulsiveness,
            "patience": r.patience,
            "focus": r.focus,
            "reflection": r.reflection,
            "risk_taking": r.risk_taking,
            "archetype": r.archetype_label
        })
        
    return {"user_id": user_id, "data": formatted_data}