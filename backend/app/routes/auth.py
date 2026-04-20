from fastapi import APIRouter
from app.models.user import UserRegister, UserLogin, UserResponse
from app.services.user_service import UserService

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