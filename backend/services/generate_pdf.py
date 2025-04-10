import os
import glob
from fpdf import FPDF
from io import BytesIO

# Font Cache temizleme (yeni eklenecek kısım)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FONTS_DIR = os.path.join(BASE_DIR, "assets", "fonts")

# Cache temizle
for cache_file in glob.glob(os.path.join(FONTS_DIR, "*.pkl")):
    os.remove(cache_file)

FONT_PATH_REGULAR = os.path.join(FONTS_DIR, "Roboto-Regular.ttf")
FONT_PATH_BOLD = os.path.join(FONTS_DIR, "Roboto-Bold.ttf")

class PDF(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font("Roboto", "", FONT_PATH_REGULAR, uni=True)
        self.add_font("Roboto", "B", FONT_PATH_BOLD, uni=True)
        self.add_page()
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font("Roboto", "B", size=14)
        self.cell(0, 10, "Özetleme Sonucu", ln=True, align="C")
        self.ln(10)

    def add_paragraph(self, text):
        self.set_font("Roboto", "", size=12)
        self.multi_cell(0, 10, text)

    def add_bullet_points(self, text):
        self.set_font("Roboto", "", size=12)
        for line in text.split("\n"):
            if line.strip():
                self.cell(5)
                self.cell(0, 10, f"- {line.strip()}", ln=True)

    def add_categorized(self, summary_dict):
        self.set_font("Roboto", "", size=12)
        if summary_dict.get("main_idea"):
            self.set_font("Roboto", "B", size=12)
            self.cell(0, 10, "Ana Fikir:", ln=True)
            self.set_font("Roboto", "", size=12)
            self.multi_cell(0, 10, summary_dict["main_idea"])
            self.ln(5)

        if summary_dict.get("key_points"):
            self.set_font("Roboto", "B", size=12)
            self.cell(0, 10, "Önemli Noktalar:", ln=True)
            self.set_font("Roboto", "", size=12)
            self.multi_cell(0, 10, summary_dict["key_points"])
            self.ln(5)

        if summary_dict.get("conclusion"):
            self.set_font("Roboto", "B", size=12)
            self.cell(0, 10, "Sonuç:", ln=True)
            self.set_font("Roboto", "", size=12)
            self.multi_cell(0, 10, summary_dict["conclusion"])

def generate_pdf(text, summary, format_type="paragraph") -> BytesIO:
    pdf = PDF()
    pdf.set_title("Özetleme PDF")

    pdf.set_font("Roboto", "B", size=12)
    pdf.cell(0, 10, "Orijinal Metin:", ln=True)
    pdf.set_font("Roboto", "", size=12)
    pdf.multi_cell(0, 10, text)
    pdf.ln(10)

    pdf.set_font("Roboto", "B", size=12)
    pdf.cell(0, 10, "Özet:", ln=True)
    pdf.set_font("Roboto", "", size=12)

    if format_type == "bullet":
        pdf.add_bullet_points(summary)
    elif format_type == "categorized" and isinstance(summary, dict):
        pdf.add_categorized(summary)
    else:
        pdf.add_paragraph(summary)

    pdf_buffer = BytesIO()
    pdf_bytes = pdf.output(dest='S').encode('latin-1')
    pdf_buffer.write(pdf_bytes)
    pdf_buffer.seek(0)
    return pdf_buffer
