"use client";

import { useState, useMemo } from "react";
import SummaryItem from "./SummaryItem";
import { SummaryType } from "../types/types";

type Props = {
  summaries: SummaryType[];
  
  deleteSummary: (id: number) => void;
};

export default function SummaryList({ summaries,  deleteSummary }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedFormat, setSelectedFormat] = useState("");

  const tags = useMemo(() => [...new Set(summaries.flatMap(s => s.tags || []))], [summaries]);
  const formats = useMemo(() => [...new Set(summaries.map(s => s.format || "Bilinmiyor"))], [summaries]);

  const filteredSummaries = useMemo(() => {
    let filtered = [...summaries];
    if (selectedTag) filtered = filtered.filter(s => s.tags?.includes(selectedTag));
    if (selectedFormat) filtered = filtered.filter(s => s.format === selectedFormat);
    if (searchQuery)
      filtered = filtered.filter(s =>
        s.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.main_idea?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );

    return sortOption === "oldest"
      ? filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      : filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [summaries, selectedTag, selectedFormat, searchQuery, sortOption]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 ml-1.5 mb-4">Özet Geçmişim</h2>
      <input
        type="text"
        placeholder="Özette ara..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={sortOption}
          aria-label="Sıralama Seçimi"
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="newest">📅 Yeni → Eski</option>
          <option value="oldest">📅 Eski → Yeni</option>
        </select>

        <select
          value={selectedFormat}
          aria-label="Tür Seçimi"
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">📂 Tüm Türler</option>
          {formats.map((format) => (
            <option key={format} value={format}>{format}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4 m-1.5 mb-2">
        {filteredSummaries.length === 0 ? (
          <p>Aramanıza uygun özet bulunamadı.</p>
        ) : (
          filteredSummaries.map((summary) => (
            <SummaryItem
              key={summary.id}
              summary={summary}
              handleDeleteSummary={deleteSummary}
              
            />
          ))
        )}
      </div>
    </div>
  );
}
