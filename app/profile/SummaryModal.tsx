import jsPDF from "jspdf";

export default function SummaryModal({ summary, closeModal }) {
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Özet", 10, 10);
        doc.text(summary.text, 10, 20);
        doc.text("Özet Sonucu", 10, 50);
        doc.text(summary.summary, 10, 60);
        doc.save(`ozet_${summary.id}.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">Tam Özet</h2>
                <p className="text-gray-700"><strong>Özet Metni:</strong> {summary.text}</p>
                <p className="text-gray-700 mt-4"><strong>Özet Sonucu:</strong> {summary.summary}</p>
                <div className="mt-4 flex justify-between">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={downloadPDF}>
                        PDF Olarak İndir
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={closeModal}>
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}
