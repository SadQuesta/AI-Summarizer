"use client";

import { useState, useContext } from "react";
import AuthContext from "@context/AuthContext";
import { createSummary } from "@/lib/api";
import { useRouter } from "next/navigation";
import { SummaryType } from "../types/types";

export default function SummarizerPage() {
  const { requireToken } = useContext(AuthContext)!;
    const token = requireToken();
  const [text, setText] = useState("");
  const [format, setFormat] = useState("paragraph");
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [length, setLength] = useState("medium");
  const router = useRouter();

  
  const handleSummarize = async () => {
    if (!text.trim()) return;
  
    setIsLoading(true);
    try {
      const token = requireToken(); // 🔐 güvenli token erişimi
      const res = await createSummary(text, format, length, token);
      setSummary(res.summary);
  
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error) {
      console.error("Özetleme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Metin Özetleyici</h1>

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Özetlemek istediğiniz metni buraya yazın..."
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Özet Formatı</label>
          <select
            aria-label="Kategori Seçimi"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="paragraph">Paragraf</option>
            <option value="bullet">Madde İşaretli</option>
            <option value="categorized">Kategorize</option>
            <option value="short">Kısa</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Özet Uzunluğu</label>
          <select
            aria-label="Uzunluk Seçimi"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          >
            <option value="short">Kısa</option>
            <option value="medium">Orta</option>
            <option value="long">Uzun</option>
          </select>
        </div>
      </div>

      <button
        className={`w-full py-2 rounded-lg text-white font-semibold transition-colors ${
          isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={handleSummarize}
        disabled={isLoading}
      >
        {isLoading ? "Özetleniyor..." : "Özetle"}
      </button>

      {summary && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Özet Sonucu</h2>

          {format === "categorized" ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Ana Fikir</h3>
                <p>{summary.main_idea}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Önemli Noktalar</h3>
                <p>{summary.key_points}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Sonuç</h3>
                <p>{summary.conclusion}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Etiketler</h3>
                <ul className="flex flex-wrap gap-2">
                  {summary.tags?.map((tag, idx) => (
                    <li
                      key={idx}
                      className="bg-blue-100 text-blue-800 py-1 px-2 rounded-lg text-sm"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <p>{summary.summary}</p>
              <h3 className="text-lg font-semibold mt-4">Etiketler</h3>
              <ul className="flex flex-wrap gap-2">
                {summary.tags?.map((tag, idx) => (
                  <li
                    key={idx}
                    className="bg-blue-100 text-blue-800 py-1 px-2 rounded-lg text-sm"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
