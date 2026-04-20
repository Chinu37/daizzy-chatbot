# Daizzy AI Chatbot — Velour Luxury E-commerce

An AI-powered luxury fashion chatbot built with React + Python FastAPI + SQLite.

## Features
- AI Chat powered by Groq (LLaMA 3.3)
- User Authentication (Register/Login)
- Product Catalog with smart filtering
- Cart & Checkout
- Order Management & Tracking
- Outfit Builder
- Style Quiz
- Gamification & Rewards
- Customer Support

## Tech Stack
**Frontend:** React, TypeScript, TailwindCSS, Vite  
**Backend:** Python, FastAPI, SQLAlchemy, SQLite  
**AI:** Groq API (LLaMA 3.3-70b)

## Setup

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### Frontend
```bash
npm install
npm run dev
```

## Environment Variables
Create `backend/.env`: