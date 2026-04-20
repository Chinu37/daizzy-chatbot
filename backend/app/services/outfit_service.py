import json
import uuid
from pathlib import Path
from app.models.outfit import BuildOutfit, SaveOutfit
from app.services.product_service import ProductService

DB_FILE = Path("app/data/outfits.json")
product_service = ProductService()

class OutfitService:

    def __init__(self):
        DB_FILE.parent.mkdir(parents=True, exist_ok=True)
        if not DB_FILE.exists():
            DB_FILE.write_text("[]")

    def _load(self):
        return json.loads(DB_FILE.read_text())

    def _save(self, data):
        DB_FILE.write_text(json.dumps(data, indent=2))

    def build_outfit(self, data: BuildOutfit):
        # Get products matching occasion and gender
        all_products = product_service.filter(
            occasion=data.occasion,
            gender=data.gender,
            style=data.style,
            max_price=data.max_budget
        )

        # Pick one item per category
        categories = ["top", "bottom", "shoes", "accessory", "dress", "bag", "watch", "perfume"]
        outfit = {}

        for category in categories:
            items = [p for p in all_products if p.category == category]
            if items:
                outfit[category] = items[0].dict()

        total = sum(item["price"] for item in outfit.values())

        return {
            "occasion": data.occasion,
            "gender": data.gender,
            "items": outfit,
            "total": total
        }

    def save_outfit(self, data: SaveOutfit):
        outfits = self._load()

        new_outfit = {
            "id": str(uuid.uuid4()),
            "user_id": data.user_id,
            "name": data.name,
            "occasion": data.occasion,
            "items": data.items
        }

        outfits.append(new_outfit)
        self._save(outfits)
        return new_outfit

    def get_user_outfits(self, user_id: str):
        outfits = self._load()
        return [o for o in outfits if o["user_id"] == user_id]