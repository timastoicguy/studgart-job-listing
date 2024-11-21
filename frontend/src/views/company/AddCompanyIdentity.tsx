/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import axios from "axios";
import { FaSort, FaSearch, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/tablechecked";
import ConfirmationDialog from "../component/ConfirmationDialog";
import { notification } from "antd";
import useAuthStore from "@/store/auth/useAuthStore";

// Định nghĩa kiểu dữ liệu cho User
interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

const AddCompanyIdentity = () => {
  const { userData } = useAuthStore(); // Lấy thông tin người dùng từ store
  const [accounts, setAccounts] = useState<User[]>([]); // Danh sách tài khoản
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [page, setPage] = useState(1); // Trang hiện tại
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [limit, setLimit] = useState(10); // Số lượng tài khoản mỗi trang

  // Trạng thái và dữ liệu liên quan đến hộp thoại xác nhận
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Xử lý chuyển đổi trang
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Hàm lấy danh sách tài khoản
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page,
        limit,
        role: "recruiter",
      };
      if (searchTerm) {
        params.email = searchTerm;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users`,
        { params }
      );
      const { users, totalPages } = response.data.data;
      setAccounts(users);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchAccounts khi thay đổi trang, giới hạn hoặc từ khóa tìm kiếm
  useEffect(() => {
    fetchAccounts();
  }, [page, limit, searchTerm]);

  // Xử lý khi người dùng nhấn nút phê duyệt
  const handleApprove = (userId: string) => {
    setSelectedUserId(userId);
    setConfirmationMessage("Bạn có chắc chắn muốn thêm nhân sự này?");
    setIsDialogOpen(true);
  };

  // Xác nhận thêm nhân sự vào công ty
  const handleConfirmApprove = async () => {
    if (!selectedUserId) return;

    try {
      const company_id = userData.company_id ?? null;

      if (!company_id) {
        console.error("Company ID not found in user data");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/recruiters`,
        { params: { user_id: selectedUserId } }
      );

      const recruiterId =
        response.data.data.length > 0 ? response.data.data[0]._id : null;

      if (!recruiterId) {
        console.error("Recruiter not found for this user.");
        return;
      }

      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/recruiters/${recruiterId}`,
        { user_id: selectedUserId, company_id }
      );

      // Hiển thị thông báo thành công
      notification.success({
        message: "Thành công",
        description: "Nhân sự đã được thêm vào công ty.",
        placement: "topRight",
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error approving employee:", error);

      // Hiển thị thông báo lỗi
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi thêm nhân sự.",
        placement: "topRight",
      });
    }
  };

  // Hủy phê duyệt
  const handleCancelApprove = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="px-2 py-4 md:px-4 rounded bg-white shadow-lg max-w-6xl mx-auto">
      <div className="mb-4 text-black">
        <h2 className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Thông tin nhân sự
        </h2>
        <p className="mb-2">Đây là danh sách nhân sự</p>
        <div className="flex flex-col md:flex-row items-start mb-4">
          <div className="flex flex-row md:flex-row items-center">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="search"
                className="border border-gray-400 hover:border-blue-500 rounded-md pl-10 pr-4 py-1 h-8 w-[400px]"
                placeholder="Tìm theo email"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-black">
                <div className="flex justify-between items-center">
                  STT <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[180px] text-black">
                <div className="flex justify-between items-center">
                  Tên người dùng <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[180px] text-black">
                <div className="flex justify-between items-center">
                  Email <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div className="flex justify-between items-center">
                  Số điện thoại <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div className="flex justify-between items-center">
                  Địa chỉ <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[60px] text-black">
                <div className="flex justify-between items-center">
                  Giới thiệu <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div className="flex justify-between items-center">
                  Hoạt động
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Hiện tại chưa có người đăng ký
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account, index) => (
                <TableRow key={account._id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>{account.username || "N/A"}</TableCell>
                  <TableCell>{account.email || "N/A"}</TableCell>
                  <TableCell>{account.phone || "N/A"}</TableCell>
                  <TableCell>{account.address || "N/A"}</TableCell>
                  <TableCell>{account.bio || "N/A"}</TableCell>
                  <TableCell>
                    <button className="text-green-500 hover:text-green-700 mx-1"
                      onClick={() => handleApprove(account._id)}>
                      <FaCheck title="Thêm nhân sự" size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationPrevious
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Trang trước
            </PaginationPrevious>
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
            <PaginationNext
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Trang sau
            </PaginationNext>
          </Pagination>
        </div>
      </div>


        <ConfirmationDialog
          isOpen={isDialogOpen}
          message={confirmationMessage}
          onConfirm={handleConfirmApprove}
          onCancel={handleCancelApprove}
        />
    </div>
  );
};

export default AddCompanyIdentity;
