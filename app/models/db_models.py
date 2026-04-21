from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), unique=True, index=True) # E.g., "hacker_1"
    grade = Column(Integer, nullable=True)
    board = Column(String(50), nullable=True)
    stream = Column(String(50), nullable=True)

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.user_id"))
    subject = Column(String(50))
    raw_responses = Column(JSON) # Stores the raw answers submitted by React
    created_at = Column(DateTime, default=datetime.utcnow)

class ExtractedFeatures(Base):
    __tablename__ = "extracted_features"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.user_id"))
    
    # Technical Features
    accuracy_overall = Column(Float, default=0.0)
    accuracy_easy = Column(Float, default=0.0)
    accuracy_medium = Column(Float, default=0.0)
    accuracy_hard = Column(Float, default=0.0)
    avg_response_time = Column(Float, default=0.0)
    carelessness_rate = Column(Float, default=0.0)
    
    # Characteristic Features
    impulsiveness = Column(Float, default=0.0)
    patience = Column(Float, default=0.0)
    focus = Column(Float, default=0.0)
    reflection = Column(Float, default=0.0)
    risk_taking = Column(Float, default=0.0)
    
    # K-Means Archetype Label (Filled later by A3)
    archetype_label = Column(String(50), nullable=True)