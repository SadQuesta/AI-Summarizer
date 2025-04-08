"use client";

import jsPDF from "jspdf";
import { SummaryType } from "../types/types";

type Props = {
  summary: SummaryType;
  closeModal: () => void;
};

export default function SummaryModal({ summary, closeModal }: Props) {
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("📄 Özet Bilgisi", 10, 10);

    doc.setFontSize(12);
    doc.text("📌 Özet Metni:", 10, 20);
    doc.text(summary.text || "-", 10, 30, { maxWidth: 190 });

    doc.text("📎 Özet Sonucu:", 10, 60);
    doc.text(summary.summary || "-", 10, 70, { maxWidth: 190 });

    doc.save(`ozet_${summary.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Tam Özet</h2>

        <div className="space-y-4 text-gray-700 text-sm">
          <div>
            <strong className="block mb-1 text-gray-800">📌 Özet Metni:</strong>
            <p className="whitespace-pre-line">{summary.text}</p>
          </div>

          <div>
            <strong className="block mb-1 text-gray-800">📎 Özet Sonucu:</strong>
            <p className="whitespace-pre-line">{summary.summary}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={downloadPDF}
          >
            PDF Olarak İndir
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={closeModal}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
