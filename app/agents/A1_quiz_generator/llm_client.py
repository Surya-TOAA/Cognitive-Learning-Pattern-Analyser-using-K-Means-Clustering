import os
import json
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

# The new, modern way to initialize the Gemini client
client = genai.Client(api_key=API_KEY)

def clean_json_response(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Fallback in case of some weird formatting
        text = re.sub(r"```json\s*", "", text)
        text = re.sub(r"```\s*", "", text)
        return json.loads(text)

def build_prompt(subject, distribution):
    return f"""
You are an expert adaptive quiz generator.
Generate a technical quiz for subject: {subject}

Difficulty distribution:
Easy: {distribution['easy']}
Medium: {distribution['medium']}
Hard: {distribution['hard']}

Return STRICT JSON only.
No explanations.
No markdown.
Format:
{{
  "technical_quiz": {{
    "questions": [
      {{
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "answer": "...",
        "difficulty": "easy/medium/hard"
      }}
    ]
  }},
  "characteristic_quiz": {{
    "questions": [
      {{
        "question": "...",
        "options": [
          {{
            "text": "...",
            "impulsiveness": 0-3,
            "patience": 0-3,
            "focus": 0-3,
            "reflection": 0-3,
            "risk_taking": 0-3
          }}
        ]
      }}
    ]
  }}
}}
"""

def generate_full_quiz(subject, difficulty_profile):
    prompt = build_prompt(subject, difficulty_profile["distribution"])

    try:
        # The new generate_content syntax
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        
        cleaned = clean_json_response(response.text)
        return cleaned
    except Exception as e:
        return {"error": "Failed to parse Gemini response", "details": str(e)}