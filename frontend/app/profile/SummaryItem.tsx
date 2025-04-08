"use client";

import { useState, useContext } from "react";
import { SummaryType } from "../types/types";
import DeleteSummary from "./DeleteSummary";
import { formatDateTime } from "./FormatDate";
import AuthContext from "../context/AuthContext";

type Props = {
  summary: SummaryType;
  handleDeleteSummary: (id: number) => void;
  openModal: (summary: SummaryType) => void;
};

export default function SummaryItem({ summary, handleDeleteSummary, openModal }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { token } = useContext(AuthContext)!;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={`bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
        isExpanded ? "max-h-full" : "max-h-24 overflow-hidden"
      }`}
      onClick={toggleExpand}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-sky-900">
            {summary.main_idea?.slice(0, 30) || summary.text?.slice(0, 30) || "Başlık yok"}...
          </h3>
          <p className="text-gray-500 italic text-sm">{summary.text?.slice(0, 40)}...</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Created at:</span> {formatDateTime(summary.created_at)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal(summary);
              }}
              className="text-blue-500 hover:underline text-sm"
            >
              Detay
            </button>
            <DeleteSummary summaryId={summary.id} handleDelete={handleDeleteSummary} />
          </div>
        </div>
      </div>
    </div>
  );
}
