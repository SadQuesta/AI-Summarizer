from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Summary, User
from backend.auth import decode_access_token
from backend.services.openai_service import summarize_text
from backend.services.generate_pdf import generate_pdf
from pydantic import BaseModel, Field

router = APIRouter(tags=["summaries"])

# ---------------------------- MODELLER ----------------------------

class SummaryRequest(BaseModel):
    text: str = Field(..., description="Özetlenecek metin")
    format_type: str = Field("paragraph", description="Özet formatı: categorized, paragraph, bullet veya short")
    length: str = Field("medium", description="Özet uzunluğu: short, medium veya long")

class CategorizedSummaryRequest(BaseModel):
    text: str
    format: str
    main_idea: str
    key_points: str
    conclusion: str

# ---------------------------- ORTAK FONKSİYON ----------------------------

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token gerekli!")
    
    token = authorization.split("Bearer ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Geçersiz token!")
    
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı!")
    
    return user

# ---------------------------- METİN ÖZETLE ----------------------------

@router.post("/summarize")
async def create_summary(
    request: SummaryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await summarize_text(
        text=request.text,
        format_type=request.format_type,
        length=request.length
    )

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    new_summary = Summary(
        user_id=current_user.id,
        text=request.text,
        summary=result.get("summary", ""),
        format=request.format_type,
        main_idea=result.get("main_idea"),
        key_points=result.get("key_points"),
        conclusion=result.get("conclusion"),
        tags=result.get("tags")
    )

    db.add(new_summary)
    db.commit()
    db.refresh(new_summary)

    return {
        "id": new_summary.id,
        "summary": result
    }

# ---------------------------- KATEGORİLİ ÖZETİ KAYDET ----------------------------

@router.post("/summaries/save")
async def save_categorized_summary(
    data: CategorizedSummaryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    summary = Summary(
        text=data.text,
        main_idea=data.main_idea,
        key_points=data.key_points,
        conclusion=data.conclusion,
        format=data.format,
        user_id=current_user.id
    )

    db.add(summary)
    db.commit()
    db.refresh(summary)

    return {
        "message": "Kategorili özet başarıyla kaydedildi!",
        "id": summary.id
    }

# ---------------------------- ÖZETİ SİL ----------------------------

@router.delete("/summaries/{summary_id}")
def delete_summary(
    summary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    summary = db.query(Summary).filter(
        Summary.id == summary_id,
        Summary.user_id == current_user.id
    ).first()

    if not summary:
        raise HTTPException(status_code=404, detail="Özet bulunamadı.")

    db.delete(summary)
    db.commit()
    return {"message": "Özet başarıyla silindi."}

# ---------------------------- PDF İNDİR ----------------------------

@router.get("/summaries/{summary_id}/download-pdf")
def download_summary_pdf(
    summary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    summary = db.query(Summary).filter(
        Summary.id == summary_id,
        Summary.user_id == current_user.id
    ).first()

    if not summary:
        raise HTTPException(status_code=404, detail="Özet bulunamadı.")

    summary_content = summary.summary
    if summary.format == "categorized":
        summary_content = { 
            "main_idea": summary.main_idea,
            "key_points": summary.key_points,
            "conclusion": summary.conclusion
        }

    pdf_buffer = generate_pdf(summary.text, summary_content, format_type=summary.format)

    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename=summary_{summary_id}.pdf"
    })

# ---------------------------- FAVORİ DURUMU DEĞİŞTİR ----------------------------

@router.patch("/summaries/{summary_id}/toggle-favorite")
def toggle_favorite_summary(
    summary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    summary = db.query(Summary).filter(
        Summary.id == summary_id,
        Summary.user_id == current_user.id
    ).first()

    if not summary:
        raise HTTPException(status_code=404, detail="Özet bulunamadı.")

    summary.is_favorite = not summary.is_favorite
    db.commit()
    db.refresh(summary)

    return {"message": "Favori durumu değiştirildi.", "is_favorite": summary.is_favorite}