import React from "react";

const NoteCard = ({ tittle, content, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{tittle}</h3>
      <p className="text-gray-600 mb-4">{content}</p>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
