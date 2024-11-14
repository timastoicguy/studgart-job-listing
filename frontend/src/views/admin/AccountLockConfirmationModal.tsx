import React, { useState } from 'react';
import axios from 'axios';

interface AccountLockConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAccounts: string[];
  fetchAccounts: () => void;
}

const AccountLockConfirmationModal: React.FC<AccountLockConfirmationModalProps> = ({
  isOpen,
  onClose,
  selectedAccounts,
  fetchAccounts
}) => {
  const [loading, setLoading] = useState(false);

  // Xử lý khóa nhiều tài khoản cùng lúc
  const handleLockAccounts = async () => {
    setLoading(true);
    try {
      // Gọi API để khóa các tài khoản đã chọn
      await Promise.all(
        selectedAccounts.map((accountId) =>
          lockAccount(accountId)
        )
      );
      setLoading(false);
      fetchAccounts(); // Cập nhật danh sách tài khoản
      console.log("Các tài khoản đã được khóa");
      onClose(); // Đóng modal sau khi khóa xong
    } catch (error) {
      console.error("Có lỗi khi khóa tài khoản:", error);
      setLoading(false);
    }
  };

  // Hàm khóa tài khoản chung cho cả hai trường hợp
  const lockAccount = async (accountId: string) => {
    await axios.patch(`http://localhost:3000/api/users/${accountId}`, {
      isActive: false // Khóa tài khoản
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Xác nhận khóa tài khoản</h3>
          <p className="mb-6">Bạn có chắc chắn muốn khóa {selectedAccounts.length} tài khoản đã chọn không?</p>
          <div className="flex justify-between">
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Hủy bỏ
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleLockAccounts}
              disabled={loading}
            >
              {loading ? "Đang khóa..." : "Khóa tài khoản"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AccountLockConfirmationModal;
