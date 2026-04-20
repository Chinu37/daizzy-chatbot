from fastapi import APIRouter
from typing import Optional
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])
product_service = ProductService()

@router.get("/")
def get_all_products():
    products = product_service.get_all()
    return {"success": True, "products": products}

@router.get("/filter")
def filter_products(
    category: Optional[str] = None,
    occasion: Optional[str] = None,
    style: Optional[str] = None,
    gender: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    tag: Optional[str] = None
):
    products = product_service.filter(category, occasion, style, gender, min_price, max_price, tag)
    return {"success": True, "count": len(products), "products": products}

@router.get("/{product_id}")
def get_product(product_id: str):
    product = product_service.get_by_id(product_id)
    if not product:
        return {"success": False, "message": "Product not found"}
    return {"success": True, "product": product}