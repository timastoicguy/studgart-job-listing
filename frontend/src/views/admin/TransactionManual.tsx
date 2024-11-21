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
import { format } from "date-fns";

// Định nghĩa kiểu dữ liệu cho User
interface Transaction {
  _id: string;
  user_id: string;
  email: string;
  amount: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  urlImage: string;
}

const TransactionManual = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Định rõ kiểu dữ liệu cho transactions
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);

  // Trạng thái cho hộp thoại xác nhận
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };  
  // Fetch Transactions Data
  const fetchUserEmail = async (userId: string): Promise<string> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`
      );
      return response.data?.data?.email || "N/A"; // Trả về email hoặc "N/A" nếu không tìm thấy
    } catch (error) {
      console.error(`Error fetching user email for userId ${userId}:`, error);
      return "N/A"; // Trả về "N/A" nếu xảy ra lỗi
    }
  };
  
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments?page=${page}&limit=${limit}`
      );
  
      const data = response.data?.data;
      console.log("Data:", data);
  
      if (data) {
        // Dùng Promise.all để lấy email cho tất cả user_id
        const updatedTransactions = await Promise.all(
          data.docs.map(async (transaction: any) => {
            const email = await fetchUserEmail(transaction.user); // Lấy email từ API
            return {
              ...transaction,
              email, // Gắn email vào từng transaction
            };
          })
        );
  
        setTransactions(updatedTransactions); // Cập nhật danh sách giao dịch
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu giao dịch.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTransactions();
  }, [page, limit, searchTerm]);
  

  const handleApprove = (transactionId: string) => {
    setSelectedUserId(transactionId); // Lưu transactionId để xác nhận
    setConfirmationMessage(
      "Bạn có chắc chắn muốn xác nhận giao dịch này?"
    );
    setIsDialogOpen(true); // Mở hộp thoại xác nhận
  };
  
  const handleConfirmApprove = async () => {
    if (!selectedUserId) return; // Không thực hiện nếu không có transactionId
  
    try {
      setLoading(true); // Bắt đầu trạng thái loading
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/approve`,
        {
          transactionId: selectedUserId,
          status: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const { data, error } = response.data;
      if (!error) {
        // Cập nhật danh sách giao dịch sau khi xác nhận thành công
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction._id === selectedUserId ? { ...transaction, status: "completed" } : transaction
          )
        );
  
        // Hiển thị thông báo thành công
        notification.success({
          message: "Thành công",
          description: `Giao dịch ID ${selectedUserId} đã được xác nhận.`,
          placement: "topRight",
        });
      } else {
        // Hiển thị thông báo lỗi từ API
        notification.error({
          message: "Lỗi",
          description: error || "Có lỗi xảy ra khi xử lý giao dịch.",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error approving transaction:", error);
  
      // Hiển thị thông báo lỗi nếu có
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý giao dịch.",
        placement: "topRight",
      });
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
      setIsDialogOpen(false); // Đóng hộp thoại xác nhận
      setSelectedUserId(null); // Reset transactionId
    }
  };
  
  const handleCancelApprove = () => {
    setIsDialogOpen(false); // Đóng hộp thoại xác nhận nếu người dùng từ chối
  };
  const handleViewImage = (urlImage: string | null) => {
    if (!urlImage) {
      // Nếu không có URL hình ảnh, bạn có thể hiển thị thông báo lỗi hoặc không làm gì cả
      notification.error({
        message: "Lỗi",
        description: "Không tìm thấy hình ảnh giao dịch.",
        placement: "topRight",
      });
      return;
    }
  
    // Mở tab mới để hiển thị hình ảnh
    window.open(urlImage, "_blank", "noopener,noreferrer");
  };
  
  

  return (
    <div className="px-2 py-4 md:px-4 rounded bg-white shadow-lg max-w-6xl mx-auto">
      <div className="mb-4 text-black">
        <h2 className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Thông tin giao dịch
        </h2>
        <p className="mb-2">Đây là danh sách giao dịch</p>
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
                  Email <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[180px] text-black">
                <div className="flex justify-between items-center">
                  Thời gian giao dịch <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div className="flex justify-between items-center">
                  Nội dung giao dịch <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div className="flex justify-between items-center">
                  Số tiền <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[60px] text-black">
                <div className="flex justify-between items-center">
                  Trạng thái <FaSort />
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
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Hiện tại chưa có người đăng ký
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction, index) => (
                <TableRow key={transaction._id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>{transaction.email || "N/A"}</TableCell>
                  <TableCell>
  {transaction.createdAt 
    ? format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm:ss")
    : "N/A"}
</TableCell>
                  <TableCell>{transaction.paymentMethod || "N/A"}</TableCell>
                  <TableCell>{transaction.amount || "N/A"}</TableCell>
                  <TableCell>{transaction.status || "N/A"}</TableCell>
                  <TableCell>
                  <button
  className={`text-blue-500 mx-1 ${!transaction.urlImage ? "cursor-not-allowed opacity-50" : "hover:text-blue-700"}`}
  onClick={() => handleViewImage(transaction.urlImage)}
  disabled={!transaction.urlImage} // Vô hiệu hóa nếu không có URL hình ảnh
>
  <FaEye title="Xem" size={18} />
</button>

                    <button
                      className="text-green-500 hover:text-green-700 mx-1"
                      onClick={() => handleApprove(transaction._id)}
                    >
                      <FaCheck title="Thêm nhân sự" size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700 mx-1">
                      <FaTimes title="Từ Chối" size={18} />
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

export default TransactionManual;
