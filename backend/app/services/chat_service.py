from groq import Groq
from app.models.chat import ChatRequest

import os
from dotenv import load_dotenv
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY)

class ChatService:

    def get_response(self, data: ChatRequest) -> str:
        messages = [
            {
                "role": "system",
                "content": "You are Daizzy, an AI luxury fashion stylist for Velour, a premium Indian fashion e-commerce brand. Help users find outfits, recommend products, and give personalized styling advice. Be warm, elegant, and concise."
            }
        ]

        # Add history
        for msg in data.history:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })

        # Add current message
        messages.append({
            "role": "user",
            "content": data.message
        })

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=500
        )

        return response.choices[0].message.content