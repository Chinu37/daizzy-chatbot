from sqlalchemy.orm import Session
from app.core.database import SessionLocal, CartDB
from app.models.cart import AddToCart

class CartService:

    def _get_db(self) -> Session:
        return SessionLocal()

    def get_cart(self, user_id: str):
        db = self._get_db()
        try:
            items = db.query(CartDB).filter(CartDB.user_id == user_id).all()
            return [{
                "product_id": item.product_id,
                "name": item.name,
                "price": item.price,
                "image": item.image,
                "category": item.category,
                "quantity": item.quantity
            } for item in items]
        finally:
            db.close()

    def add_item(self, item: AddToCart):
        db = self._get_db()
        try:
            # Check if product already in cart
            existing = db.query(CartDB).filter(
                CartDB.user_id == item.user_id,
                CartDB.product_id == item.product_id
            ).first()

            if existing:
                existing.quantity += 1
                db.commit()
            else:
                new_item = CartDB(
                    user_id=item.user_id,
                    product_id=item.product_id,
                    name=item.name,
                    price=item.price,
                    image=item.image,
                    category=item.category,
                    quantity=1
                )
                db.add(new_item)
                db.commit()

            return self.get_cart(item.user_id)
        finally:
            db.close()

    def remove_item(self, user_id: str, product_id: str):
        db = self._get_db()
        try:
            db.query(CartDB).filter(
                CartDB.user_id == user_id,
                CartDB.product_id == product_id
            ).delete()
            db.commit()
            return self.get_cart(user_id)
        finally:
            db.close()

    def clear_cart(self, user_id: str):
        db = self._get_db()
        try:
            db.query(CartDB).filter(CartDB.user_id == user_id).delete()
            db.commit()
            return []
        finally:
            db.close()