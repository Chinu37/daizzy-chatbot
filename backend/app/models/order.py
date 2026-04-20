from pydantic import BaseModel
from typing import List, Optional

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    image: str
    category: str
    quantity: int

class PlaceOrder(BaseModel):
    user_id: str
    items: List[OrderItem]
    address: str
    payment_method: str = "COD"