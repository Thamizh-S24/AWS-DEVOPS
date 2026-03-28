import requests
import json
import re
from decouple import config

OPENROUTER_API_KEY = config('OPENROUTER_API_KEY', default='')

def generate_ai_quiz(course_name, level, num_questions):
    prompt = f"""
    You are an expert curriculum developer. Generate a quiz for the course "{course_name}" at {level} level.
    The quiz must have exactly {num_questions} multiple-choice questions.
    Each question must have exactly 4 choices, with exactly 1 correct choice.
    Return ONLY a raw JSON object with this exact structure (no markdown blocks, no code formatting):
    {{
        "title": "A catchy title for the quiz",
        "description": "A short description",
        "questions": [
            {{
                "text": "The question text",
                "choices": [
                    {{"text": "Choice 1", "is_correct": true}},
                    {{"text": "Choice 2", "is_correct": false}},
                    {{"text": "Choice 3", "is_correct": false}},
                    {{"text": "Choice 4", "is_correct": false}}
                ]
            }}
        ]
    }}
    """
    
    response = requests.post(
      url="https://openrouter.ai/api/v1/chat/completions",
      headers={
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
      },
      data=json.dumps({
        "model": "openrouter/auto", 
        "messages": [
          {"role": "user", "content": prompt}
        ]
      })
    )
    
    try:
        data = response.json()
        raw_text = data['choices'][0]['message']['content']
        # Clean markdown
        raw_text = re.sub(r"```json(?:\n)*", "", raw_text)
        raw_text = re.sub(r"```(?:\n)*", "", raw_text)
        raw_text = raw_text.strip()
        
        return json.loads(raw_text)
    except Exception as e:
        print("AI Gen Error:", e)
        return None
def get_chatbot_response(user_message, user_context=""):
    system_prompt = f"""
    You are LearnBot AI, a helpful and encouraging mentor for Learn Hub, an online learning platform.
    Your goal is to assist students with their academic doubts, career advice, and platform navigation.
    IMPORTANT: Provide very short, concise, and direct answers. Avoid long summaries or wordy explanations. 
    Get straight to the point. Use markdown formatting (lists, bold text) sparingly and only for extreme clarity.
    
    Student Context: {user_context}
    """
    
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": "openrouter/auto", 
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
            })
        )
        
        data = response.json()
        if 'choices' in data and len(data['choices']) > 0:
            return data['choices'][0]['message']['content']
        return f"I'm sorry, I'm having trouble processing that right now. (Error: {data.get('error', 'Unknown')})"
    except Exception as e:
        print("AI Chatbot Error:", e)
        return "Connection issue: I couldn't reach my neural core. Please check your internet or try later!"
