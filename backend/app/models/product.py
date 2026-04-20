from pydantic import BaseModel
from typing import List, Optional

class Product(BaseModel):
    id: str
    name: str
    price: float
    image: str
    category: str
    occasions: List[str]
    styles: List[str]
    gender: str
    color: Optional[str] = None
    tags: Optional[List[str]] = []
    season: Optional[str] = None