from openai import OpenAI
import os
from dotenv import load_dotenv
import logging
import tiktoken

load_dotenv()
client = OpenAI()

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

MAX_TOKENS_PER_CHUNK = 3000  # GPT-4o için önerilen güvenli limit

# ------------------------------ Token hesaplama ------------------------------
def count_tokens(text: str, model: str = "gpt-4o") -> int:
    enc = tiktoken.encoding_for_model(model)
    return len(enc.encode(text))

# ------------------------------ Metni chunk'lara böl ------------------------------
def chunk_text(text: str, max_tokens: int = MAX_TOKENS_PER_CHUNK) -> list:
    words = text.split()
    chunks, current_chunk = [], []

    for word in words:
        current_chunk.append(word)
        if count_tokens(" ".join(current_chunk)) > max_tokens:
            current_chunk.pop()
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]

    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    return chunks

# ------------------------------ Kategorize edilmiş çıktıyı parse et ------------------------------
def parse_categorized_summary(text):
    categories = {"main_idea": "", "key_points": "", "conclusion": ""}
    current_category = None

    for line in text.split('\n'):
        if line.startswith("###"):
            header = line[3:].strip().lower()
            if "ana fikir" in header:
                current_category = "main_idea"
            elif "önemli noktalar" in header:
                current_category = "key_points"
            elif "sonuç" in header:
                current_category = "conclusion"
        elif current_category:
            categories[current_category] += line.strip() + "\n"

    return {k: v.strip() for k, v in categories.items()}

# ------------------------------ Gelişmiş tag çıkarımı ------------------------------
async def extract_tags_via_openai(text: str, max_tags: int = 5):
    prompt = (
        f"Verilen metinden en fazla {max_tags} adet kısa ve anlamlı etiket çıkar. "
        "Etiketleri sadece virgülle ayırarak yaz.\n\n"
        f"Metin:\n{text}"
    )

    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Sen profesyonel bir metin analiz uzmanısın ve verilen metinlerden en alakalı etiketleri çıkarıyorsun. Etiketleri Türkçe olarak üret."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
        )

        tags_response = completion.choices[0].message.content.strip()
        tags = [tag.strip() for tag in tags_response.split(",") if tag.strip()]
        
        return tags[:max_tags]

    except Exception as e:
        logger.error(f"OpenAI API hatası (Tag çıkarma): {str(e)}")
        return []


# ------------------------------ Ana özetleme fonksiyonu ------------------------------
async def summarize_text(text: str, format_type: str = "paragraph", length: str = "medium"):
    try:
        length_instructions = {
            "short": "Çok kısa, özlü ve tek cümlelik bir özet oluştur.",
            "medium": "Orta uzunlukta, önemli noktaları kapsayan bir özet oluştur.",
            "long": "Uzun ve detaylı, kapsamlı bir özet üret."
        }

        length_prompt = length_instructions.get(length, "Orta uzunlukta, önemli noktaları kapsayan bir özet oluştur.")
        format_prompts = {
            "categorized": (
                "Aşağıdaki metni kategorilere ayrılmış şekilde özetle:\n"
                "- Ana Fikir\n"
                "- Önemli Noktalar\n"
                "- Sonuç\n"
                "Her başlığı '### ' ile belirt. Madde madde yaz.\n"
                f"{length_prompt}"
            ),
            "paragraph": f"Aşağıdaki metni bir paragraf halinde özetle:\n{length_prompt}",
            "bullet": f"Aşağıdaki metni kısa madde işaretleriyle özetle:\n{length_prompt}",
            "short": "Aşağıdaki metni tek bir cümlede özetle."
        }

        prompt_template = format_prompts.get(format_type, f"Aşağıdaki metni özetle:\n{length_prompt}")
        chunks = chunk_text(text)

        summaries = []
        for chunk in chunks:
            completion = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a professional summarizer that does not translate text."},
                    {"role": "user", "content": f"{prompt_template}\n\n{chunk}"}
                ]
            )
            summaries.append(completion.choices[0].message.content.strip())

        full_summary = "\n\n".join(summaries)
        
        # 🔥 Profesyonel etiket çıkarımını burada çağırıyoruz
        tags = await extract_tags_via_openai(text)

        if format_type == "categorized":
            categorized_result = parse_categorized_summary(full_summary)
            categorized_result["tags"] = tags
            return categorized_result
        else:
            return {
                "summary": full_summary,
                "tags": tags,
                "category": format_type,
            }

    except Exception as e:
        logger.error(f"OpenAI API hatası: {str(e)}")
        return {"error": "Özetleme sırasında bir hata oluştu."}
