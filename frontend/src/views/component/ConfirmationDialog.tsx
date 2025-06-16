import React from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null; // If the dialog is not open, return nothing

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dialog Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onCancel}
      ></div>

      {/* Dialog Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 ">
        <h2 className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">Xác nhận</h2>
        
        {/* Message Box with Rounded Corners */}
        <div className="bg-white p-4 rounded-md border border-gray-300 my-2">
          <p>{message}</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Đồng ý
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
