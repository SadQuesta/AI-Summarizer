"use client";

import { useState, useMemo, useContext } from "react";
import SummaryItem from "./SummaryDetail";
import { SummaryType } from "../types/types";
import AuthContext from "@context/AuthContext";

type Props = {
  summaries: SummaryType[];
  openModal: (summaryId: number) => void;
  deleteSummary: (id: number) => void;
};

const extractUniqueTags = (summaries: SummaryType[]) => {
  const allTags = summaries.flatMap((s) => s.tags || []);
  return Array.from(new Set(allTags));
};

const extractUniqueFormats = (summaries: SummaryType[]) => {
  const formats = summaries.map((s) => s.format || "Bilinmiyor");
  return Array.from(new Set(formats));
};

export default function SummaryList({ summaries, openModal, deleteSummary }: Props) {
    const { requireToken } = useContext(AuthContext)!;
    const token = requireToken();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("");

  const tags = useMemo(() => extractUniqueTags(summaries), [summaries]);
  const formats = useMemo(() => extractUniqueFormats(summaries), [summaries]);

  const filteredSummaries = useMemo(() => {
    let filtered = summaries;

    if (selectedTag) {
      filtered = filtered.filter((s) => s.tags?.includes(selectedTag));
    }

    if (selectedFormat) {
      filtered = filtered.filter((s) => s.format === selectedFormat);
    }

    if (onlyFavorites) {
      filtered = filtered.filter((s) => s.is_favorite);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s) =>
        s.text?.toLowerCase().includes(query) ||
        s.summary?.toLowerCase().includes(query) ||
        s.main_idea?.toLowerCase().includes(query) ||
        s.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (sortOption === "oldest") {
      filtered = filtered.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      filtered = filtered.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [summaries, selectedTag, selectedFormat, searchQuery, sortOption, onlyFavorites]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 ml-1.5 mb-4">Özet Geçmişim</h2>

      {/* 🔍 Arama kutusu */}
      <input
        type="text"
        placeholder="Özette ara..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />

      {/* 🧩 Filtreler */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          aria-label="Sıralama Seçimi"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="newest">📅 Yeni → Eski</option>
          <option value="oldest">📅 Eski → Yeni</option>
        </select>

        <select
          aria-label="Tür Seçimi"
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">📂 Tüm Türler</option>
          {formats.map((format) => (
            <option key={format} value={format}>
              📁 {format.charAt(0).toUpperCase() + format.slice(1)}
            </option>
          ))}
        </select>

       
      </div>

      {/* 🏷 Etiketler */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded-full border ${!selectedTag ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            onClick={() => setSelectedTag(null)}
          >
            Tümü
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full border ${selectedTag === tag ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* 📋 Özet listesi */}
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
