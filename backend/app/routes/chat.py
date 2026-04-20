from fastapi import APIRouter
from app.models.chat import ChatRequest
from app.services.chat_service import ChatService
from app.core.database import SessionLocal, ChatHistoryDB

router = APIRouter(prefix="/chat", tags=["Daizzy AI Chat"])
chat_service = ChatService()

@router.post("/message")
def send_message(data: ChatRequest):
    response = chat_service.get_response(data)

    # Save to SQLite
    db = SessionLocal()
    try:
        chat_entry = ChatHistoryDB(
            user_id=data.user_id,
            user_message=data.message,
            ai_response=response
        )
        db.add(chat_entry)
        db.commit()
    finally:
        db.close()

    return {"success": True, "response": response}

@router.get("/history/{user_id}")
def get_chat_history(user_id: str):
    db = SessionLocal()
    try:
        history = db.query(ChatHistoryDB).filter(
            ChatHistoryDB.user_id == user_id
        ).all()
        return {
            "success": True,
            "user_id": user_id,
            "history": [{
                "user": h.user_message,
                "ai": h.ai_response,
                "timestamp": h.timestamp.isoformat()
            } for h in history]
        }
    finally:
        db.close()

@router.delete("/history/{user_id}")
def clear_chat_history(user_id: str):
    db = SessionLocal()
    try:
        db.query(ChatHistoryDB).filter(ChatHistoryDB.user_id == user_id).delete()
        db.commit()
        return {"success": True, "message": "Chat history cleared"}
    finally:
        db.close()