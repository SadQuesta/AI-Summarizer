from pydantic import BaseModel, EmailStr, constr
from datetime import datetime

# Kullanıcı Kayıt Modeli
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: constr(min_length=6)  # 🔥 Şifre en az 6 karakter olmalı
    

# Kullanıcı Giriş Modeli
class UserLogin(BaseModel):
    login_id: str  # Kullanıcı adı veya e-posta girilebilir
    password: str

# Kullanıcı Profil Modeli (API çıktısı için)
class UserProfile(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str = "user"
    profile_picture: str | None  # Profil resmi opsiyonel olabilir

    class Config:
        from_attributes = True  # SQLAlchemy modellerini dönüştürebilmek için

# Kullanıcı Özet Modeli
class SummarySchema(BaseModel):
    id: int
    text: str
    summary: str
    created_at: datetime

    class Config:
        from_attributes = True  # SQLAlchemy modelleri ile uyumlu hale getir
