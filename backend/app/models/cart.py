from pydantic import BaseModel
from typing import List

class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    image: str
    category: str
    quantity: int = 1

class AddToCart(BaseModel):
    user_id: str
    product_id: str
    name: str
    price: float
    image: str
    category: str

class RemoveFromCart(BaseModel):
    user_id: str
    product_id: str