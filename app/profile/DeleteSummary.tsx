interface DeleteSummaryProps {
    summaryId: number; // summaryId'nin tipi number olmalı
    handleDelete: (id: number) => void; // handleDelete fonksiyonu bir id almalı
  }
  
  export default function DeleteSummary({ summaryId, handleDelete }: DeleteSummaryProps) {
    return (
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(summaryId); // summaryId'yi kullanarak handleDelete fonksiyonunu çağırıyoruz
        }}
      >
        Sil 🗑️
      </button>
    );
  }
  