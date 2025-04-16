"use client";

import { useState, useMemo } from "react";
import SummaryItem from "./SummaryItem";
import { SummaryType } from "../types/types";

type Props = {
  summaries: SummaryType[];
  deleteSummary: (id: number) => void;
};

export default function SummaryList({ summaries, deleteSummary }: Props) {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedFormat, setSelectedFormat] = useState("");

  //Take 2 tags from one summary
  const tags = useMemo(() => {
    const limitedTags = summaries.flatMap(s => s.tags?.slice(0, 2) || []);
    const uniqueTags = Array.from(new Set(limitedTags));
    return ["All", ...uniqueTags];
  }, [summaries]);

  const formats = useMemo(
    () => [...new Set(summaries.map(s => s.format || "Unknown"))],
    [summaries]
  );

  const filteredSummaries = useMemo(() => {
    let filtered = [...summaries];

    if (selectedTag !== "All") {
      filtered = filtered.filter(s => s.tags?.includes(selectedTag));
    }

    if (selectedFormat) {
      filtered = filtered.filter(s => s.format === selectedFormat);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.text?.toLowerCase().includes(query) ||
        s.summary?.toLowerCase().includes(query) ||
        s.main_idea?.toLowerCase().includes(query) ||
        s.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return sortOption === "oldest"
      ? filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      : filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [summaries, selectedTag, selectedFormat, searchQuery, sortOption]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 ml-1.5 mb-4">Summary History</h2>

      <input
        type="text"
        placeholder="Search in Summary..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />

      {/* TAG Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-sm transition ${
              selectedTag === tag
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Sort and Format Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={sortOption}
          aria-label="Sıralama Seçimi"
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="newest">📅 New → Old</option>
          <option value="oldest">📅 Old → New</option>
        </select>

        <select
          value={selectedFormat}
          aria-label="Tür Seçimi"
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">📂 All Species</option>
          {formats.map((format) => (
            <option key={format} value={format}>{format}</option>
          ))}
        </select>
      </div>

      {/* Summaries */}
      <div className="space-y-4 m-1.5 mb-2">
        {filteredSummaries.length === 0 ? (
          <p>No abstracts matching your search found.</p>
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
