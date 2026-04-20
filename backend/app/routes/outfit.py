from fastapi import APIRouter
from app.models.outfit import BuildOutfit, SaveOutfit
from app.services.outfit_service import OutfitService

router = APIRouter(prefix="/outfit", tags=["Outfit Builder"])
outfit_service = OutfitService()

@router.post("/build")
def build_outfit(data: BuildOutfit):
    outfit = outfit_service.build_outfit(data)
    return {"success": True, "outfit": outfit}

@router.post("/save")
def save_outfit(data: SaveOutfit):
    outfit = outfit_service.save_outfit(data)
    return {"success": True, "message": "Outfit saved", "outfit": outfit}

@router.get("/user/{user_id}")
def get_user_outfits(user_id: str):
    outfits = outfit_service.get_user_outfits(user_id)
    return {"success": True, "count": len(outfits), "outfits": outfits}