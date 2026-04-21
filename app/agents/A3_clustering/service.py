import joblib
import numpy as np
from sqlalchemy.orm import Session
from app.models.db_models import ExtractedFeatures

class ClusteringService:
    def __init__(self):
        # Load the models you just trained!
        self.scaler = joblib.load("ml_models/scaler.pkl")
        self.kmeans = joblib.load("ml_models/kmeans_model.pkl")
        
        # Map the random cluster IDs to your custom archetypes
        self.archetype_mapping = {
            0: "Slow and Steady",
            1: "Cashew Nut",
            2: "Zombie",
            3: "Weak Basement"
        }

    def predict_archetype(self, db: Session, user_id: str):
        # 1. Fetch the user's extracted features from A2
        features = db.query(ExtractedFeatures).filter(ExtractedFeatures.user_id == user_id).first()
        
        if not features:
            return {"error": "User features not found. Did A2 run?"}

        # 2. Build the numeric feature vector exactly as trained
        feature_vector = np.array([[
            features.accuracy_overall,
            features.accuracy_easy,
            features.accuracy_medium,
            features.accuracy_hard,
            features.avg_response_time,
            features.carelessness_rate,
            features.impulsiveness,
            features.patience,
            features.focus,
            features.reflection,
            features.risk_taking
        ]])

        # 3. Normalize using the saved scaler
        scaled_vector = self.scaler.transform(feature_vector)
        
        # 4. Predict the cluster ID using KMeans
        cluster_id = int(self.kmeans.predict(scaled_vector)[0])
        archetype = self.archetype_mapping.get(cluster_id, "Unknown")

        # 5. Save the archetype label back into the database
        features.archetype_label = archetype
        db.commit()

        return {
            "user_id": user_id,
            "cluster_id": cluster_id,
            "archetype": archetype,
            "message": "Successfully mapped cognitive archetype!"
        }