import os
import json
import re
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

MODEL = "qwen/qwen3-235b-a22b-thinking-2507"

def generate_guidance(features):
    prompt = f"""
    You are an expert AI academic counselor.
    The student has been classified as the '{features.archetype_label}' learning archetype.
    
    Their performance metrics:
    - Overall Accuracy: {features.accuracy_overall * 100:.1f}%
    - Carelessness Rate: {features.carelessness_rate * 100:.1f}%
    - Average Response Time: {features.avg_response_time:.1f} seconds
    
    Psychological traits (0-3 scale):
    - Impulsiveness: {features.impulsiveness:.1f}
    - Patience: {features.patience:.1f}
    - Focus: {features.focus:.1f}
    
    Provide a personalized study plan and motivational advice in structured JSON format:
    {{
        "archetype_explanation": "...",
        "strengths": ["...", "..."],
        "areas_for_improvement": ["...", "..."],
        "actionable_study_plan": ["...", "...", "..."],
        "motivation": "..."
    }}
    
    Return strictly JSON without markdown formatting or backticks.
    """
    
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        text = response.choices[0].message.content
        # Robust JSON extraction
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            text = json_match.group(0)
        return json.loads(text)
    except Exception as e:
        return {"error": "Failed to generate guidance", "details": str(e)}

def chat_with_coach(features, user_message, chat_history=None):
    history_context = ""
    if chat_history:
        history_context = "\nPrevious Conversation:\n" + "\n".join([f"{m['role']}: {m['text']}" for m in chat_history])

    if features and features.archetype_label:
        system_context = f"""
        The student is classified as the '{features.archetype_label}' learning archetype.
        
        Student Profile:
        - Overall Accuracy: {features.accuracy_overall * 100:.1f}%
        - Carelessness Rate: {features.carelessness_rate * 100:.1f}%
        - Average Response Time: {features.avg_response_time:.1f} seconds
        - Impulsiveness: {features.impulsiveness:.1f}/3
        - Patience: {features.patience:.1f}/3
        - Focus: {features.focus:.1f}/3

        Context: Use the student's archetype and metrics to provide highly specific, actionable coaching.
        """
    else:
        system_context = """
        This is a NEW student with no analyzed learning patterns yet.
        Context: Act as a friendly, expert tutor. Answer their queries helpfully. 
        Crucial: At the end of your response, if relevant, gently encourage them to take a few more quizzes so you can analyze their cognitive patterns and provide personalized guidance.
        """

    prompt = f"""
    You are an expert AI academic counselor and learning coach.
    {system_context}
    {history_context}
    Student Message: {user_message}

    Respond in a friendly, professional, and encouraging tone. Keep the response concise but impactful.
    Return strictly plain text (no JSON, no markdown).
    """

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        # Thinking models sometimes include <thought> blocks, we remove them just in case
        content = response.choices[0].message.content
        content = re.sub(r'<thought>.*?</thought>', '', content, flags=re.DOTALL)
        return content.strip()
    except Exception as e:
        return f"I'm sorry, I'm having a bit of trouble connecting right now. Let me try again in a moment. (Error: {str(e)})"
