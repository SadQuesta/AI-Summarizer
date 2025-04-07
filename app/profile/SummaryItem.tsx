import { useContext, useState } from "react";
import DeleteSummary from "./DeleteSummary";
import { formatDateTime } from "./FormatDate";
import AuthContext from "../context/AuthContext";
import { downloadSummaryAsPDF } from "@/lib/api";

export default function SummaryItem({ summary, handleDeleteSummary, toggleFavorite, openModal }) {
    const { token } = useContext(AuthContext);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${isExpanded ? "max-h-full" : "max-h-24"
                }`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-sky-900">
                        {summary?.main_idea?.slice(0, 30) || summary?.text?.slice(0, 30) || "Başlık yok"}...
                    </h3>
                    <p className="text-gray-500 italic text-sm">
                        {summary?.text?.slice(0, 40)}...
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">Created at:</span>{" "}
                        {summary.created_at ? formatDateTime(summary.created_at) : "Tarih yok"}
                    </p>
                    <div className="flex gap-2">
                        {/* ⭐ Favori toggle butonu */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(summary.id);
                            }}
                            className={`text-xl ${summary.is_favorite ? "text-yellow-500" : "text-gray-400"}`}
                            title="Favori"
                        >
                            {summary.is_favorite ? "★" : "☆"}
                        </button>
                        <DeleteSummary summaryId={summary.id} handleDelete={handleDeleteSummary} />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 p-5 bg-gray-100 rounded-xl space-y-4 text-[15px]">
                    <h2 className="text-xl font-bold text-gray-800">Özet:</h2>
                    <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(summary.id);
                            }}
                            className={`text-xl ${summary.is_favorite ? "text-yellow-500" : "text-gray-400"}`}
                            title="Favori"
                        >
                            {summary.is_favorite ? "★" : "☆"}
                        </button>
                    {summary.main_idea && (
                        <div>
                            <h3 className="text-lg font-bold text-blue-700">Ana Fikir</h3>
                            <p className="text-gray-800 whitespace-pre-line mt-1">{summary.main_idea}</p>
                        </div>
                    )}

                    {summary.key_points && (
                        <div>
                            <h3 className="text-lg font-bold text-amber-800">Önemli Noktalar</h3>
                            <p className="text-gray-800 whitespace-pre-line mt-1">{summary.key_points}</p>
                        </div>
                    )}

                    {summary.conclusion && (
                        <div>
                            <h3 className="text-lg font-bold text-red-700">Sonuç</h3>
                            <p className="text-gray-800 whitespace-pre-line mt-1">{summary.conclusion}</p>
                        </div>
                    )}

                    {/* PDF Butonu */}
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            downloadSummaryAsPDF(summary.id, token);
                        }}
                    >
                        PDF Olarak İndir
                    </button>
                </div>
            )}
        </div>
    );
}
