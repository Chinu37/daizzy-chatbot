from fastapi import APIRouter
from app.models.support import SupportTicket
from app.core.database import SessionLocal, SupportTicketDB

router = APIRouter(prefix="/support", tags=["Customer Support"])

@router.post("/ticket")
def create_ticket(data: SupportTicket):
    db = SessionLocal()
    try:
        ticket = SupportTicketDB(
            user_id=data.user_id or "guest",
            name=data.name,
            email=data.email,
            subject=data.subject,
            message=data.message,
            status="open"
        )
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        return {
            "success": True,
            "message": "Support ticket created successfully",
            "ticket_id": ticket.id,
            "status": ticket.status
        }
    finally:
        db.close()

@router.get("/tickets")
def get_all_tickets():
    db = SessionLocal()
    try:
        tickets = db.query(SupportTicketDB).all()
        return {
            "success": True,
            "count": len(tickets),
            "tickets": [{
                "id": t.id,
                "user_id": t.user_id,
                "name": t.name,
                "email": t.email,
                "subject": t.subject,
                "message": t.message,
                "status": t.status,
                "created_at": t.created_at.isoformat()
            } for t in tickets]
        }
    finally:
        db.close()

@router.patch("/ticket/{ticket_id}/status")
def update_ticket_status(ticket_id: int, status: str):
    db = SessionLocal()
    try:
        ticket = db.query(SupportTicketDB).filter(SupportTicketDB.id == ticket_id).first()
        if not ticket:
            return {"success": False, "message": "Ticket not found"}
        ticket.status = status
        db.commit()
        return {"success": True, "message": "Status updated", "ticket_id": ticket_id, "status": status}
    finally:
        db.close()