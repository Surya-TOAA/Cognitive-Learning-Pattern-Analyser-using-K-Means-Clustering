from sqlalchemy.orm import Session
from app.models.db_models import ExtractedFeatures
from app.agents.A4_guidance_generator.llm_client import generate_guidance, chat_with_coach

class GuidanceService:
    def get_personalized_advice(self, db: Session, user_id: str):
        # 1. Fetch all the math and the archetype label from the database
        features = db.query(ExtractedFeatures).filter(ExtractedFeatures.user_id == user_id).first()
        
        if not features or not features.archetype_label:
            return {"error": "User features or archetype not found. Did A2 and A3 run?"}
        
        # 2. Feed it to Gemini
        advice = generate_guidance(features)
        
        return {
            "user_id": user_id,
            "archetype": features.archetype_label,
            "guidance": advice
        }

    def chat_with_coach(self, db: Session, user_id: str, user_message: str, chat_history: list = None):
        features = db.query(ExtractedFeatures).filter(ExtractedFeatures.user_id == user_id).first()
        return chat_with_coach(features, user_message, chat_history)

