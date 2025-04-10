from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Summary, User
from auth import decode_access_token
from services.generate_pdf import generate_pdf

import os, uuid




router = APIRouter(tags=["profile"])

# ---------------------- Ortak Kullanıcı Doğrulama ----------------------

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

# ---------------------- Kullanıcı Bilgilerini Getir ----------------------

@router.get("/")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "profile_picture": current_user.profile_picture,
        "banner_url": current_user.banner_url
    }

# ---------------------- Kullanıcının Özetlerini Getir ----------------------

@router.get("/summaries")
async def get_user_summaries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    summaries = db.query(Summary).filter(Summary.user_id == current_user.id).all()

    return {
        "summaries": [
            {
                "id": s.id,
                "text": s.text,
                "summary": s.summary,
                "main_idea": s.main_idea,
                "key_points": s.key_points,
                "conclusion": s.conclusion,
                "tags": s.tags,
                "format": s.format,
                "is_favorite:":s.is_favorite,
                "created_at": s.created_at.isoformat() if s.created_at else None
            }
            for s in summaries
        ]
    }

# ---------------------- Profil Fotoğrafı Yükle ----------------------

UPLOAD_PROFILE_DIR = "uploads/profile_images"
os.makedirs(UPLOAD_PROFILE_DIR, exist_ok=True)

@router.post("/upload-profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(UPLOAD_PROFILE_DIR, filename)

        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        image_url = f"http://127.0.0.1:8000/uploads/profile_images/{filename}"
        current_user.profile_picture = image_url
        db.commit()
        db.refresh(current_user)

        return {"image_url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------- Yapay Zeka Banner Oluşturma ----------------------

# UPLOAD_BANNER_DIR = "uploads/banners"
# os.makedirs(UPLOAD_BANNER_DIR, exist_ok=True)


# pipe = None
# if os.environ.get("DISABLE_BANNER") != "1":
#     model_id = "CompVis/stable-diffusion-v1-4"
#     pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
#         model_id,
#         torch_dtype=torch.float16 if torch.device == "cuda" else torch.float32
#     )
#     pipe.to(torch.device)


# @router.post("/generate-banner")
# async def generate_banner(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     if os.environ.get("DISABLE_BANNER") == "1":
#         raise HTTPException(status_code=503, detail="Banner üretimi şu anda devre dışı.")

#     try:
        

#         if not current_user.profile_picture:
#             raise HTTPException(status_code=400, detail="Lütfen önce bir profil fotoğrafı yükleyin.")

#         # 🔍 Profil fotoğrafı dosya yolunu çöz
#         url_path = current_user.profile_picture.replace("http://127.0.0.1:8000/", "")
#         image_path = os.path.join(os.getcwd(), url_path)

#         if not os.path.exists(image_path):
#             raise HTTPException(status_code=400, detail="Profil fotoğrafı bulunamadı.")

#         # 📸 Profil fotoğrafını aç
#         init_image = Image.open(image_path).convert("RGB")
#         init_image = init_image.resize((768, 512))  # ideal çözünürlük

#         # 🎨 Prompt
#         prompt = "A stylish, futuristic,animated,tech-inspired banner design based on the user's profile picture"

#         # 🔥 Görsel üret
#         image = pipe(prompt=prompt, image=init_image, strength=0.75, guidance_scale=7.5).images[0]

#         # 💾 Kaydet
#         banner_filename = f"{uuid.uuid4()}_banner.png"
#         banner_path = os.path.join(UPLOAD_BANNER_DIR, banner_filename)
#         image.save(banner_path)

#         # 🌐 Veritabanına yaz
#         current_user.banner_url = f"http://127.0.0.1:8000/uploads/banners/{banner_filename}"
#         db.commit()
#         db.refresh(current_user)

#         return {"banner_url": current_user.banner_url}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Banner oluşturulamadı: {str(e)}")




# ---------------------- PDF İndir ----------------------

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

    format_type = summary.format or "paragraph"
    pdf_buffer = generate_pdf(summary.text, summary_content, format_type=format_type)

    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename=summary_{summary_id}.pdf"
    })
