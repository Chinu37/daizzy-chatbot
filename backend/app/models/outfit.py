from pydantic import BaseModel
from typing import List, Optional

class BuildOutfit(BaseModel):
    user_id: str
    occasion: str
    gender: str
    style: Optional[str] = None
    max_budget: Optional[float] = None

class SaveOutfit(BaseModel):
    user_id: str
    name: str
    occasion: str
    items: List[str]  # list of product IDs