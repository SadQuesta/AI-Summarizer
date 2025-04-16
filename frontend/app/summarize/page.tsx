"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireToken } from "@hooks/useRequireToken";
import { createSummary, downloadSummaryAsPDF } from "@/lib/api";
import { SummaryType } from "../types/types";

export default function SummarizerPage() {
  const token = useRequireToken();
  const router = useRouter();

  const [text, setText] = useState("");
  const [format, setFormat] = useState("paragraph");
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [length, setLength] = useState("medium");

  const summaryFormats = [
    { label: "Paragrph", value: "paragraph" },
    { label: "Bullet Points", value: "bullet" },
    { label: "Categorized", value: "categorized" },
    { label: "Short", value: "short" },
  ];

  const lengthMap = ["short", "medium", "long"];

  if (!token) return null;

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const res = await createSummary(text, format, length, token);
      setSummary({
        ...res.summary,
        id: res.id, // ✅ ID'yi burada özetin içine ekliyoruz
      });
    } catch (error) {
      console.error("Özetleme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!summary?.id) return;
    try {
      await downloadSummaryAsPDF(summary.id, token);
    } catch (error) {
      console.error("PDF indirme hatası:", error);
    }
  };

  return (
    <div className="max-w-9xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg flex flex-col lg:flex-row gap-6 min-h-[600px]">
      {/* Sol Panel */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Summarizer</h1>

        {/* Format ve Uzunluk Seçimi */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {summaryFormats.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFormat(item.value)}
                  className={`px-4 py-2 rounded-lg border font-medium transition ${
                    format === item.value
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 min-w-[220px]">
              <span className="text-sm text-gray-600">Short</span>
              <input
                aria-label="Length Selection"
                type="range"
                min={0}
                max={2}
                step={1}
                value={lengthMap.indexOf(length)}
                onChange={(e) => setLength(lengthMap[parseInt(e.target.value)])}
                className="w-full accent-blue-600"
              />
              <span className="text-sm text-gray-600">Long</span>
            </div>
          </div>
        </div>

        {/* Metin Girişi */}
        <textarea
          className="w-full text-base p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write the text you want to summarize here..."
          aria-label="Özetlenecek metin girişi"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className={`w-full py-2 rounded-lg text-white font-semibold transition-colors ${
            isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleSummarize}
          disabled={isLoading}
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </button>
      </div>

      {/* Sağ Panel */}
      {summary && (
        <div className="w-full lg:w-[50%] bg-gray-50 border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">📄 Summary</h2>

            {format === "categorized" ? (
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-700">Main Idea</h3>
                  <p>{summary.main_idea}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Important Points</h3>
                  <p>{summary.key_points}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Result</h3>
                  <p>{summary.conclusion}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Tags</h3>
                  <ul className="flex flex-wrap gap-2">
                    {summary.tags?.map((tag, idx) => (
                      <li key={idx} className="bg-blue-100 text-blue-800 py-1 px-2 rounded-lg text-xs">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-sm">
                <p>{summary.summary}</p>
                <h3 className="font-semibold mt-4 text-gray-700">Tickets</h3>
                <ul className="flex flex-wrap gap-2">
                  {summary.tags?.map((tag, idx) => (
                    <li key={idx} className="bg-blue-100 text-blue-800 py-1 px-2 rounded-lg text-xs">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mt-4"
            onClick={handleDownloadPDF}
          >
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}
