"use client";

import { useContext, useState, useMemo } from "react";
import SummaryItem from "./SummaryDetail";
import AuthContext from "../context/AuthContext";

const extractUniqueTags = (summaries) => {
    const allTags = summaries.flatMap(s => s.tags || []);
    return Array.from(new Set(allTags));
};

const extractUniqueFormats = (summaries) => {
    const formats = summaries.map(s => s.format || "Bilinmiyor");
    return Array.from(new Set(formats));
};

export default function SummaryList({ openModal }) {
    const { summaries, deleteSummary } = useContext(AuthContext);

    const [selectedTag, setSelectedTag] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("newest");
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState("");

    const tags = useMemo(() => extractUniqueTags(summaries), [summaries]);
    const formats = useMemo(() => extractUniqueFormats(summaries), [summaries]);

    const toggleFavorite = (id) => {
        const summaryIndex = summaries.findIndex(s => s.id === id);
        if (summaryIndex === -1) return;
        summaries[summaryIndex].is_favorite = !summaries[summaryIndex].is_favorite;
    };

    const filteredSummaries = useMemo(() => {
        let filtered = summaries;

        if (selectedTag) {
            filtered = filtered.filter(s => s.tags?.includes(selectedTag));
        }

        if (selectedFormat) {
            filtered = filtered.filter(s => s.format === selectedFormat);
        }

        if (onlyFavorites) {
            filtered = filtered.filter(s => s.is_favorite);
        }

        if (searchQuery) {
            filtered = filtered.filter((s) =>
                s.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.main_idea?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (sortOption === "oldest") {
            filtered = filtered.slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else {
            filtered = filtered.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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

            {/* 🧩 Filtreler: Sıralama + Favori + Tür */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="newest">📅 Yeni → Eski</option>
                    <option value="oldest">📅 Eski → Yeni</option>
                </select>

                <select
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

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={onlyFavorites}
                        onChange={(e) => setOnlyFavorites(e.target.checked)}
                    />
                    <span>⭐ Sadece Favoriler</span>
                </label>
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
                    {tags.map(tag => (
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
                            toggleFavorite={toggleFavorite}
                            openModal={openModal}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
