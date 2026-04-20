from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.products import router as products_router
from app.routes.cart import router as cart_router
from app.routes.orders import router as orders_router
from app.routes.quiz import router as quiz_router
from app.routes.outfit import router as outfit_router
from app.routes.chat import router as chat_router
from app.core.database import init_db
from app.routes.support import router as support_router

app = FastAPI(title="Daizzy Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(auth_router)
app.include_router(products_router)
app.include_router(cart_router)
app.include_router(orders_router)
app.include_router(quiz_router)
app.include_router(outfit_router)
app.include_router(chat_router)
app.include_router(support_router)

@app.get("/")
def root():
    return {"message": "Daizzy Backend is running 🚀"}