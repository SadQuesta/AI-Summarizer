from fpdf import FPDF
import os
from io import BytesIO

class PDF(FPDF):
    def __init__(self):
        super().__init__()
        base_dir = os.path.dirname(os.path.abspath(__file__))
        fonts_dir = os.path.join(base_dir, "assets", "fonts")
        font_path_regular = os.path.join(fonts_dir, "Roboto-Regular.ttf")
        font_path_bold = os.path.join(fonts_dir, "Roboto-Bold.ttf")

        self.add_font("Roboto", "", font_path_regular, uni=True)
        self.add_font("Roboto", "B", font_path_bold, uni=True)
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

    # Orijinal metin
    pdf.set_font("Roboto", "B", size=12)
    pdf.cell(0, 10, "Orijinal Metin:", ln=True)
    pdf.set_font("Roboto", "", size=12)
    pdf.multi_cell(0, 10, text)
    pdf.ln(10)

    # Özet
    pdf.set_font("Roboto", "B", size=12)
    pdf.cell(0, 10, "Özet:", ln=True)
    pdf.set_font("Roboto", "", size=12)

    if format_type == "bullet":
        pdf.add_bullet_points(summary)
    elif format_type == "categorized" and isinstance(summary, dict):
        pdf.add_categorized(summary)
    else:
        pdf.add_paragraph(summary)

    # PDF'i bellekte oluştur
    pdf_buffer = BytesIO()
    pdf_bytes = pdf.output(dest='S').encode('latin-1')
    pdf_buffer.write(pdf_bytes)
    pdf_buffer.seek(0)
    return pdf_buffer
