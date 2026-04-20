from pydantic import BaseModel
from typing import Optional

class SupportTicket(BaseModel):
    name: str
    email: str
    subject: str
    message: str
    user_id: Optional[str] = "guest"