from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import summarize, auth, profile  
from routes.summarize import router as upload_router
from fastapi.staticfiles import StaticFiles



app = FastAPI(title="Summarizer API", version="1.0")

# 🌍 CORS Middleware (Frontend ile haberleşme için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-summarizer-d3p5oc7xg-mustafa-nafi-ugurs-projects.vercel.app"],  # Frontend'in erişmesine izin ver
    allow_credentials=True,
    allow_methods=["*"],  # Sadece belirli HTTP metodlarına izin ver
    allow_headers=["*"],  # Güvenliği artırmak için sadece gerekli başlıkları ekle
    expose_headers=["*"]
)

# 🚀 Route'ları ekle

app.include_router(summarize.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(profile.router, prefix="/api/profile")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
# ✅ Uygulama Başlatma (Standalone Mod)
