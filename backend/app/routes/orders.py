from fastapi import APIRouter
from app.models.order import PlaceOrder
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])
order_service = OrderService()

@router.post("/place")
def place_order(data: PlaceOrder):
    order = order_service.place_order(data)
    return {"success": True, "message": "Order placed successfully", "order": order}

@router.get("/user/{user_id}")
def get_user_orders(user_id: str):
    orders = order_service.get_user_orders(user_id)
    return {"success": True, "count": len(orders), "orders": orders}

@router.get("/{order_id}")
def get_order(order_id: str):
    order = order_service.get_order_by_id(order_id)
    if not order:
        return {"success": False, "message": "Order not found"}
    return {"success": True, "order": order}

@router.patch("/{order_id}/status")
def update_status(order_id: str, status: str):
    order = order_service.update_status(order_id, status)
    if not order:
        return {"success": False, "message": "Order not found"}
    return {"success": True, "message": "Status updated", "order": order}