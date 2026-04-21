from sqlalchemy.orm import Session
from app.models.db_models import User, QuizAttempt, ExtractedFeatures
from app.schemas.response_schema import QuizSubmission

class DataCollectorService:
    def process_submission(self, db: Session, submission: QuizSubmission):
        
        # 1. Prevent Foreign Key Error: Check if user exists, if not, create them
        user = db.query(User).filter(User.user_id == submission.user_id).first()
        if not user:
            user = User(user_id=submission.user_id)
            db.add(user)
            db.commit()
            db.refresh(user)

        # 2. Store the raw attempt for record-keeping
        raw_data = submission.model_dump()
        attempt = QuizAttempt(
            user_id=submission.user_id,
            subject=submission.subject,
            raw_responses=raw_data
        )
        db.add(attempt)
        
        # 3. Extract Technical Features
        tech = submission.technical_answers
        total_q = len(tech)
        
        easy_q = [q for q in tech if q.difficulty == "easy"]
        med_q = [q for q in tech if q.difficulty == "medium"]
        hard_q = [q for q in tech if q.difficulty == "hard"]
        
        acc_overall = sum(1 for q in tech if q.is_correct) / total_q if total_q > 0 else 0.0
        acc_easy = sum(1 for q in easy_q if q.is_correct) / len(easy_q) if easy_q else 0.0
        acc_med = sum(1 for q in med_q if q.is_correct) / len(med_q) if med_q else 0.0
        acc_hard = sum(1 for q in hard_q if q.is_correct) / len(hard_q) if hard_q else 0.0
        
        avg_time = sum(q.response_time_seconds for q in tech) / total_q if total_q > 0 else 0.0
        
        # Carelessness: Wrong answer but answered in under 15 seconds
        careless_count = sum(1 for q in tech if not q.is_correct and q.response_time_seconds < 15.0)
        carelessness_rate = careless_count / total_q if total_q > 0 else 0.0

        # 4. Extract Characteristic Features (Averages)
        chars = submission.characteristic_answers
        total_char = len(chars)
        
        imp = sum(c.impulsiveness for c in chars) / total_char if total_char > 0 else 0.0
        pat = sum(c.patience for c in chars) / total_char if total_char > 0 else 0.0
        foc = sum(c.focus for c in chars) / total_char if total_char > 0 else 0.0
        ref = sum(c.reflection for c in chars) / total_char if total_char > 0 else 0.0
        risk = sum(c.risk_taking for c in chars) / total_char if total_char > 0 else 0.0
        
        # 5. Save Clean Features to DB for A3 to use later
        features = ExtractedFeatures(
            user_id=submission.user_id,
            accuracy_overall=acc_overall,
            accuracy_easy=acc_easy,
            accuracy_medium=acc_med,
            accuracy_hard=acc_hard,
            avg_response_time=avg_time,
            carelessness_rate=carelessness_rate,
            impulsiveness=imp,
            patience=pat,
            focus=foc,
            reflection=ref,
            risk_taking=risk
        )
        
        db.add(features)
        db.commit()
        db.refresh(features)
        
        return features