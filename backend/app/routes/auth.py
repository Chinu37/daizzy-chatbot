from fastapi import APIRouter
from app.models.user import UserRegister, UserLogin, UserResponse
from app.services.user_service import UserService
from app.core.database import SessionLocal, UserDB

router = APIRouter(prefix="/auth", tags=["Auth"])
user_service = UserService()

@router.post("/register")
def register(data: UserRegister):
    user, error = user_service.register(data)
    if error:
        return {"success": False, "message": error}
    return {
        "success": True,
        "message": "Registration successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "address": user["address"]
        }
    }

@router.post("/login")
def login(data: UserLogin):
    user, error = user_service.login(data.email, data.password)
    if error:
        return {"success": False, "message": error}
    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "address": user["address"]
        }
    }

@router.get("/users")
def get_all_users():
    db = SessionLocal()
    try:
        from app.core.database import UserDB
        users = db.query(UserDB).all()
        return {
            "success": True,
            "count": len(users),
            "users": [{
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "phone": u.phone,
                "address": u.address,
                "created_at": u.created_at.isoformat()
            } for u in users]
        }
    finally:
        db.close()