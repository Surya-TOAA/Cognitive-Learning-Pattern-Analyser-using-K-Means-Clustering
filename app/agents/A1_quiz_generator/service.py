from app.agents.llm_client import generate_full_quiz

def generate_quiz(subject, difficulty_profile):

    full_quiz = generate_full_quiz(subject, difficulty_profile)

    return {
        "difficulty_distribution": difficulty_profile,
        "technical_quiz": full_quiz["technical_quiz"],
        "characteristic_quiz": full_quiz["characteristic_quiz"]
    }