from fastapi import APIRouter
from app.models.cart import AddToCart, RemoveFromCart
from app.services.cart_service import CartService

router = APIRouter(prefix="/cart", tags=["Cart"])
cart_service = CartService()

@router.get("/{user_id}")
def get_cart(user_id: str):
    cart = cart_service.get_cart(user_id)
    total = sum(item["price"] * item["quantity"] for item in cart)
    return {"success": True, "cart": cart, "total": total}

@router.post("/add")
def add_to_cart(item: AddToCart):
    cart = cart_service.add_item(item)
    return {"success": True, "message": "Item added to cart", "cart": cart}

@router.delete("/remove")
def remove_from_cart(item: RemoveFromCart):
    cart = cart_service.remove_item(item.user_id, item.product_id)
    return {"success": True, "message": "Item removed from cart", "cart": cart}

@router.delete("/clear/{user_id}")
def clear_cart(user_id: str):
    cart = cart_service.clear_cart(user_id)
    return {"success": True, "message": "Cart cleared", "cart": cart}