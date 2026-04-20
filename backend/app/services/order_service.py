import uuid
import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, OrderDB
from app.models.order import PlaceOrder

class OrderService:

    def _get_db(self) -> Session:
        return SessionLocal()

    def place_order(self, data: PlaceOrder):
        db = self._get_db()
        try:
            total = sum(item.price * item.quantity for item in data.items)

            new_order = OrderDB(
                id=str(uuid.uuid4()),
                user_id=data.user_id,
                address=data.address,
                payment_method=data.payment_method,
                total=total,
                status="confirmed",
                items=json.dumps([item.dict() for item in data.items])
            )
            db.add(new_order)
            db.commit()
            db.refresh(new_order)

            return {
                "id": new_order.id,
                "user_id": new_order.user_id,
                "items": json.loads(new_order.items),
                "address": new_order.address,
                "payment_method": new_order.payment_method,
                "total": new_order.total,
                "status": new_order.status,
                "created_at": new_order.created_at.isoformat()
            }
        finally:
            db.close()

    def get_user_orders(self, user_id: str):
        db = self._get_db()
        try:
            orders = db.query(OrderDB).filter(OrderDB.user_id == user_id).all()
            return [{
                "id": o.id,
                "user_id": o.user_id,
                "items": json.loads(o.items),
                "address": o.address,
                "payment_method": o.payment_method,
                "total": o.total,
                "status": o.status,
                "created_at": o.created_at.isoformat()
            } for o in orders]
        finally:
            db.close()

    def get_order_by_id(self, order_id: str):
        db = self._get_db()
        try:
            order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
            if not order:
                return None
            return {
                "id": order.id,
                "user_id": order.user_id,
                "items": json.loads(order.items),
                "address": order.address,
                "payment_method": order.payment_method,
                "total": order.total,
                "status": order.status,
                "created_at": order.created_at.isoformat()
            }
        finally:
            db.close()

    def update_status(self, order_id: str, status: str):
        db = self._get_db()
        try:
            order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
            if not order:
                return None
            order.status = status
            db.commit()
            db.refresh(order)
            return {
                "id": order.id,
                "status": order.status
            }
        finally:
            db.close()