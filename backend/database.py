from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging

# .env dosyasını yükle
load_dotenv()

# Logger yapılandırması
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ✅ PostgreSQL bağlantısını al, yoksa fallback olarak SQLite kullan
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    logger.warning("⚠️ SQLite kullanılıyor. Üretim ortamında PostgreSQL ayarlayın!")
else:
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,        # Maksimum bağlantı sayısı
        pool_pre_ping=True,
        max_overflow=20,     # Ekstra bağlantı limiti
        echo=False           # Konsola SQL sorgularını yazma (False önerilir)
    )

# ✅ Session konfigürasyonu
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ SQLAlchemy ORM base sınıfı
Base = declarative_base()

# ✅ DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database hatası: {str(e)}")
        db.rollback()  # Eğer hata olursa işlemleri geri al
        raise
    finally:
        db.close()
