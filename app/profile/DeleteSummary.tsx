
export default function DeleteSummary({ summaryId, handleDelete }) {
    return (
        <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={(e) => {
                e.stopPropagation();
                handleDelete(summaryId);
            }}
        >
            Sil 🗑️
        </button>
    );
}
