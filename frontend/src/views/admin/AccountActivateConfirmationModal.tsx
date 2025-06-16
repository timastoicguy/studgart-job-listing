import React, { useState } from 'react';
import axios from 'axios';

interface AccountActivateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAccounts: string[];
  fetchAccounts: () => void;
}

const AccountActivateConfirmationModal: React.FC<AccountActivateConfirmationModalProps> = ({
  isOpen,
  onClose,
  selectedAccounts,
  fetchAccounts
}) => {
  const [loading, setLoading] = useState(false);

  const handleActivateAccounts = async () => {
    setLoading(true);
    console.log(selectedAccounts);
    try {
      // Activate selected accounts via API call with isActive: true
      await Promise.all(
        selectedAccounts.map(async (accountId) => {
          await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/api/users/${accountId}`,
            { isActive: true } // Gửi dữ liệu cập nhật kích hoạt tài khoản
          );
        })
      );

      setLoading(false);
      fetchAccounts(); // Refresh the account list in the parent component
      console.log("Accounts have been activated");
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error activating accounts:', error);
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Xác nhận kích hoạt tài khoản</h3>
          <p className="mb-6">Bạn có chắc chắn muốn kích hoạt {selectedAccounts.length} tài khoản đã chọn không?</p>
          <div className="flex justify-between">
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Hủy bỏ
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleActivateAccounts}
              disabled={loading}
            >
              {loading ? "Đang kích hoạt..." : "Kích hoạt tài khoản"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AccountActivateConfirmationModal;
