/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import useAuthStore from "@/store/auth/useAuthStore";
import { changePassword } from "@/lib/reducers/auth/changePassword";
import { FaSpinner } from "react-icons/fa";
function ChangePasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!currentPassword) {
        notification.warning({
          message: "Đổi mật khẩu",
          description: `Vui lòng nhập mật khẩu cũ`, // Mô tả thông báo
          placement: "topRight", // Vị trí hiển thị
        });

        return;
      }

      if (!newPassword || !confirmPassword) {
        notification.warning({
          message: "Đổi mật khẩu",
          description: `Vui lòng nhập đầy đủ thông tin cho mật khẩu mới`, // Mô tả thông báo
          placement: "topRight", // Vị trí hiển thị
        });

        return;
      }

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        notification.warning({
          message: "Đổi mật khẩu",
          description:
            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 ký tự đặc biệt, 1 chữ hoa và 1 chữ số.", // Mô tả thông báo
          placement: "topRight", // Vị trí hiển thị
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        notification.error({
          message: "Đổi mật khẩu",
          description: `Mật khẩu nhập lại không khớp`, // Mô tả thông báo
          placement: "topRight", // Vị trí hiển thị
        });
        return;
      }
      // Xử lý logic đổi mật khẩu ở đây (API call)

      const result = await changePassword(
        currentPassword,
        newPassword,
        userData._id
      );

      if (result?.error) {
        notification.error({
          message: "Đổi mật khẩu",
          description: `Mật khẩu hiện tại của bạn sai vui lòng nhập lại`, // Mô tả thông báo
          placement: "topRight", // Vị trí hiển thị
        });

        setCurrentPassword("");
        return;
      }

      if (result?.data) {
        notification.success({
          message: "Đổi mật khẩu",
          description: `Mật khẩu thay đổi thành công!`, // Mô tả thông báo
          placement: "topRight", // Vị trí hiển thị
        });
      }

      onClose(); // Đóng modal sau khi hoàn tất
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Đổi mật khẩu</h2>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu hiện tại
            </label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu mới
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Xác nhận mật khẩu
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              {loading && <FaSpinner className="mr-2 animate-spin" />}
              {!loading && "Đổi mật khẩu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
