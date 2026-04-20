import uuid
import hashlib
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, UserDB
from app.models.user import UserRegister

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

class UserService:

    def _get_db(self) -> Session:
        return SessionLocal()

    def register(self, data: UserRegister):
        db = self._get_db()
        try:
            # Check if email exists
            existing = db.query(UserDB).filter(UserDB.email == data.email).first()
            if existing:
                return None, "Email already registered"

            new_user = UserDB(
                id=str(uuid.uuid4()),
                name=data.name,
                email=data.email,
                phone=data.phone,
                address=data.address,
                password=hash_password(data.password)
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            return {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "phone": new_user.phone,
                "address": new_user.address
            }, None
        finally:
            db.close()

    def login(self, email: str, password: str):
        db = self._get_db()
        try:
            user = db.query(UserDB).filter(UserDB.email == email).first()
            if not user:
                return None, "User not found"
            if not verify_password(password, user.password):
                return None, "Invalid password"
            return {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "address": user.address
            }, None
        finally:
            db.close()