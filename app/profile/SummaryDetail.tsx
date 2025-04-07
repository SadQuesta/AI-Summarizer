import { useContext, useState } from "react";
import DeleteSummary from "./DeleteSummary";
import { formatDateTime } from "./FormatDate";
import AuthContext from "../context/AuthContext";
import { downloadSummaryAsPDF } from "@/lib/api";

export default function SummaryItem({ summary, handleDeleteSummary }) {
    const { token } = useContext(AuthContext);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const toggleExpand = () => setIsExpanded(!isExpanded);

    const handleDownloadClick = (e) => {
        e.stopPropagation();
        downloadSummaryAsPDF(summary.id, token);
    };

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
                    <p className="text-gray-500 italic text-sm">
                        {summary.text?.slice(0, 40)}...
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">Created at:</span> {summary.created_at ? formatDateTime(summary.created_at) : "Tarih yok"}
                    </p>
                    <DeleteSummary summaryId={summary.id} handleDelete={handleDeleteSummary} />
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg space-y-3">
                    <section>
                        <h4 className="font-semibold">Özet Metni:</h4>
                        <p className="text-gray-700 whitespace-pre-line">{summary.text}</p>
                    </section>

                    <section>
                        <h4 className="font-semibold">Özet Sonucu:</h4>
                        <p className="text-gray-700 whitespace-pre-line">{summary.summary}</p>
                    </section>

                    {summary.main_idea && (
                        <section>
                            <h4 className="text-blue-700 font-semibold">Ana Fikir:</h4>
                            <p className="text-gray-800 whitespace-pre-line">{summary.main_idea}</p>
                        </section>
                    )}

                    {summary.key_points && (
                        <section>
                            <h4 className="text-amber-800 font-semibold">Önemli Noktalar:</h4>
                            <ul className="list-disc list-inside text-gray-800">
                                {summary.key_points.split("\n").map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {summary.conclusion && (
                        <section>
                            <h4 className="text-red-700 font-semibold">Sonuç:</h4>
                            <p className="text-gray-800 whitespace-pre-line">{summary.conclusion}</p>
                        </section>
                    )}

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mt-4"
                        onClick={handleDownloadClick}
                    >
                        PDF Olarak İndir
                    </button>
                </div>
            )}
        </div>
    );
}