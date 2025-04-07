interface DeleteSummaryProps {
    summaryId: number;  // summaryId tipi belirtilmeli
    handleDelete: (id: number) => void;  // handleDelete fonksiyonu belirtilmeli
  }
  
  export default function DeleteSummary({ summaryId, handleDelete }: DeleteSummaryProps): JSX.Element {
    return (
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(summaryId);  // summaryId'yi kullanarak handleDelete fonksiyonunu çağırıyoruz
        }}
      >
        Sil 🗑️
      </button>
    );
  }
  