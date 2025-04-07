from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import hash_password, verify_password, create_access_token
from datetime import timedelta
from schemas import UserRegister, UserLogin
from routes.summarize import get_current_user
router = APIRouter()

# Kullanıcı kayıt
@router.post("/register")
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Bu kullanıcı adı veya e-posta zaten kullanılıyor!")

    hashed_password = hash_password(user_data.password)
    new_user = User(username=user_data.username, email=user_data.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Kullanıcı bilgilerini yenile

    return {"message": "Kullanıcı başarıyla kaydedildi"}

# Kullanıcı giriş
@router.post("/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == user_data.login_id) | (User.username == user_data.login_id)
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Bu e-posta veya kullanıcı adına sahip bir hesap bulunamadı!")

    if not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Şifre yanlış!")

    access_token = create_access_token({"sub": user.email, "user_id": user.id}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}


