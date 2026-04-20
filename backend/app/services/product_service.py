from app.models.product import Product
from typing import List, Optional

# Sample product database (migrated from ProductDatabase.ts)
PRODUCTS = [
    Product(id="fw_top_1", name="Bridal Ivory Silk Blouse", price=4890, image="https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&h=600&fit=crop", category="top", occasions=["wedding"], styles=["elegant"], gender="female", color="ivory", tags=["bestseller"]),
    Product(id="fw_top_2", name="Gold Sequin Top", price=6990, image="https://images.unsplash.com/photo-1618932260634-37f398ea8d8c?w=400&h=600&fit=crop", category="top", occasions=["wedding"], styles=["bold", "elegant"], gender="female", color="gold", tags=["trending"]),
    Product(id="fw_dress_1", name="Ivory Bridal Gown", price=18990, image="https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&h=600&fit=crop", category="dress", occasions=["wedding"], styles=["elegant", "romantic"], gender="female", color="ivory", tags=["luxury", "handcrafted"]),
    Product(id="fw_dress_2", name="Gold Embroidered Lehenga Set", price=22990, image="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop", category="dress", occasions=["wedding"], styles=["bold", "elegant"], gender="female", color="gold", tags=["bestseller", "handcrafted"]),
    Product(id="fp_top_1", name="Black Satin Camisole", price=3290, image="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=400&h=600&fit=crop", category="top", occasions=["party"], styles=["bold"], gender="female", color="black", tags=["trending"]),
    Product(id="fp_top_2", name="Red Velvet Crop Top", price=3590, image="https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=600&fit=crop", category="top", occasions=["party"], styles=["bold"], gender="female", color="red", tags=[]),
    Product(id="fo_top_1", name="White Oxford Shirt", price=3490, image="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=600&fit=crop", category="top", occasions=["office"], styles=["minimal", "classic"], gender="female", color="white", tags=["bestseller"]),
    Product(id="fo_bot_1", name="Charcoal Slim Trousers", price=4290, image="https://images.unsplash.com/photo-1594938298603-c8148c4b4157?w=400&h=600&fit=crop", category="bottom", occasions=["office"], styles=["minimal", "classic"], gender="female", color="charcoal", tags=[]),
    Product(id="mm_top_1", name="Navy Blue Linen Shirt", price=3990, image="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=600&fit=crop", category="top", occasions=["casual", "office"], styles=["minimal", "classic"], gender="male", color="navy", tags=["bestseller"]),
    Product(id="mm_top_2", name="White Classic Tee", price=1990, image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop", category="top", occasions=["casual"], styles=["minimal"], gender="male", color="white", tags=["trending"]),
    Product(id="mm_watch_1", name="Silver Chronograph Watch", price=15990, image="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=600&fit=crop", category="watch", occasions=["office", "casual", "wedding"], styles=["classic", "elegant"], gender="male", color="silver", tags=["luxury", "bestseller"]),
    Product(id="fw_perf_1", name="Velour Rose Oud EDP", price=8990, image="https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop", category="perfume", occasions=["wedding"], styles=["elegant", "romantic"], gender="female", color="rose", tags=["bestseller", "luxury"]),
]


class ProductService:

    def get_all(self) -> List[Product]:
        return PRODUCTS

    def get_by_id(self, product_id: str) -> Optional[Product]:
        return next((p for p in PRODUCTS if p.id == product_id), None)

    def filter(
        self,
        category: Optional[str] = None,
        occasion: Optional[str] = None,
        style: Optional[str] = None,
        gender: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        tag: Optional[str] = None
    ) -> List[Product]:
        results = PRODUCTS

        if category:
            results = [p for p in results if p.category == category]
        if occasion:
            results = [p for p in results if occasion in p.occasions]
        if style:
            results = [p for p in results if style in p.styles]
        if gender:
            results = [p for p in results if p.gender == gender or p.gender == "unisex"]
        if min_price is not None:
            results = [p for p in results if p.price >= min_price]
        if max_price is not None:
            results = [p for p in results if p.price <= max_price]
        if tag:
            results = [p for p in results if tag in (p.tags or [])]

        return results