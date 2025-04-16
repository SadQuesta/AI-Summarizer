import {JSX} from "react";
interface DeleteSummaryProps {
    summaryId: number;  
    handleDelete: (id: number) => void;  
  }
  
  export default function DeleteSummary({ summaryId, handleDelete }: DeleteSummaryProps): JSX.Element {
    return (
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(summaryId);  
        }}
      >
        Delete 🗑️
      </button>
    );
  }
  