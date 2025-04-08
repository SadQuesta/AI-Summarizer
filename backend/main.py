from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import summarize, auth, profile  
from backend.routes.summarize import router as upload_router
from fastapi.staticfiles import StaticFiles



app = FastAPI(title="Summarizer API", version="1.0")

# 🌍 CORS Middleware (Frontend ile haberleşme için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend'in erişmesine izin ver
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Sadece belirli HTTP metodlarına izin ver
    allow_headers=["Authorization", "Content-Type"],  # Güvenliği artırmak için sadece gerekli başlıkları ekle
    expose_headers=["Content-Disposition"]
)

# 🚀 Route'ları ekle

app.include_router(summarize.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(profile.router, prefix="/api/profile")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
# ✅ Uygulama Başlatma (Standalone Mod)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
