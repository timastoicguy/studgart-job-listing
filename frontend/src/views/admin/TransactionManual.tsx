/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Import thêm các icon cho sort
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
import ExcelJS from 'exceljs';
// Định nghĩa kiểu dữ liệu cho User
interface Transaction {
  _id: string;
  user_id: string;
  email: string;
  amount: string;
  diamonds: string;
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
  const [limit, setLimit] = useState(100);

  // Trạng thái cho hộp thoại xác nhận
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM") // Mặc định là tháng hiện tại
  );
  

  // State để lưu cột và hướng sắp xếp
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "asc" | "desc";
  } | null>(null);

  // Hàm xử lý sắp xếp
  const handleSort = (key: keyof Transaction) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Hàm sắp xếp dữ liệu dựa trên state `sortConfig`
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const valueA = a[key] || "";
    const valueB = b[key] || "";

    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Hàm render icon sort dựa trên trạng thái hiện tại
  const renderSortIcon = (key: keyof Transaction) => {
    if (!sortConfig || sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

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
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/payments?page=${page}&limit=${limit}`
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
  
  const handleExportToExcel = () => {
    // Lọc giao dịch theo tháng và trạng thái "momo" hoặc "manual"
    const filteredTransactions = transactions.filter((transaction) => {
      if (!transaction.createdAt || !(transaction.paymentMethod === "momo" || transaction.paymentMethod === "manual")) return false;
      const transactionMonth = format(new Date(transaction.createdAt), "yyyy-MM");
      return transactionMonth === selectedMonth;
    });
  
    // Tạo dữ liệu cho Excel từ giao dịch đã lọc
    const dataForExport = filteredTransactions.map((transaction, index) => ({
      STT: index + 1,
      Email: transaction.email || "N/A",
      "Thời gian giao dịch": transaction.createdAt
        ? format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm:ss")
        : "N/A",
      "Nội dung giao dịch": transaction.paymentMethod || "N/A",
      "Số tiền": transaction.amount || transaction.diamonds || 0,
      "Trạng thái": transaction.status || "N/A",
    }));
  
    if (dataForExport.length === 0) {
      notification.warning({
        message: "Thông báo",
        description: "Không có dữ liệu giao dịch cho tháng đã chọn.",
        placement: "topRight",
      });
      return;
    }
  
    // Tính tổng doanh thu và định dạng thành tiền
    const totalRevenue = filteredTransactions.reduce(
      (sum, transaction) => sum + (Number(transaction.amount) || Number(transaction.diamonds) || 0),
      0
    );
  
    const formattedTotalRevenue = new Intl.NumberFormat('vi-VN', {
      style: 'decimal', // Remove currency symbol
    }).format(totalRevenue);
  
    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DoanhThu');
  
    // Thêm tiêu đề
    const monthYear = format(new Date(`${selectedMonth}-01`), "MM/yyyy");
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = `Doanh thu tháng ${monthYear}`;
    worksheet.getCell('A1').style = {
      font: { bold: true, size: 16, color: { argb: 'FFFF0000' } }, // Red color and larger font size
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } } // White background
    };
  
    // Thêm tiêu đề các cột
    const header = ['STT', 'Email', 'Thời gian giao dịch', 'Nội dung giao dịch', 'Số tiền', 'Trạng thái'];
    worksheet.addRow(header);
  
    // Định dạng tiêu đề cột
    header.forEach((headerText, index) => {
      worksheet.getCell(2, index + 1).style = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } }, // Blue background
        border: {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
        }
      };
    });
  
    // Thêm dữ liệu giao dịch
    dataForExport.forEach((transaction) => {
      worksheet.addRow([
        transaction.STT,
        transaction.Email,
        transaction["Thời gian giao dịch"],
        transaction["Nội dung giao dịch"],
        new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(Number(transaction["Số tiền"]) || 0), // Format number without currency symbol
        transaction["Trạng thái"]
      ]);
    });
  
    // Thêm dòng tổng doanh thu
    const totalRow = ['', '', '', 'Tổng doanh thu:', formattedTotalRevenue, ''];
    worksheet.addRow(totalRow);
    worksheet.getCell(`D${dataForExport.length + 3}`).style = {
      font: { bold: true },
      alignment: { horizontal: 'right' }, // Align right
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF99' } } // Light yellow background
    };
  
    // Cân chỉnh chiều rộng cột
    worksheet.getColumn(1).width = 8; // Column A (STT)
    worksheet.getColumn(2).width = 25; // Column B (Email)
    worksheet.getColumn(3).width = 25; // Column C (Thời gian giao dịch)
    worksheet.getColumn(4).width = 30; // Column D (Nội dung giao dịch)
    worksheet.getColumn(5).width = 15; // Column E (Số tiền)
    worksheet.getColumn(6).width = 20; // Column F (Trạng thái)
  
    // Đảm bảo "Số tiền" được căn phải
    worksheet.getColumn(5).alignment = { horizontal: 'right' };
  
    // Xuất file Excel với tên chứa tháng được chọn
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `DoanhThu_${selectedMonth}.xlsx`;
      link.click();
    });
  };
  
  
  useEffect(() => {
    fetchTransactions();
  }, [page, limit, searchTerm]);

  const handleApprove = (transactionId: string) => {
    setSelectedUserId(transactionId); // Lưu transactionId để xác nhận
    setConfirmationMessage("Bạn có chắc chắn muốn xác nhận giao dịch này?");
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
            transaction._id === selectedUserId
              ? { ...transaction, status: "completed" }
              : transaction
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
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleSort("_id")}
                >
                  STT {renderSortIcon("_id")}
                </div>
              </TableHead>
              <TableHead className="w-[180px] text-black">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email {renderSortIcon("email")}
                </div>
              </TableHead>
              <TableHead className="w-[180px] text-black">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Thời gian giao dịch {renderSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleSort("paymentMethod")}
                >
                  Nội dung giao dịch {renderSortIcon("paymentMethod")}
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Số tiền {renderSortIcon("amount")}
                </div>
              </TableHead>
              <TableHead className="w-[60px] text-black">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Trạng thái {renderSortIcon("status")}
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-black">Hoạt động</TableHead>
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
              sortedTransactions.map((transaction, index) => (
                <TableRow key={transaction._id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>{transaction.email || "N/A"}</TableCell>
                  <TableCell>
                    {transaction.createdAt
                      ? format(
                          new Date(transaction.createdAt),
                          "dd/MM/yyyy HH:mm:ss"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell>{transaction.paymentMethod || "N/A"}</TableCell>
                  <TableCell>
                    {transaction.amount || transaction.diamonds}
                  </TableCell>
                  <TableCell>{transaction.status || "N/A"}</TableCell>
                  <TableCell>
                    <button
                      className={`text-blue-500 mx-1 ${
                        !transaction.urlImage
                          ? "cursor-not-allowed opacity-50"
                          : "hover:text-blue-700"
                      }`}
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

<div className="flex justify-end items-center mb-4">
  <label htmlFor="month" className="mr-2 font-medium">
    Chọn tháng:
  </label>
  <input
    type="month"
    id="month"
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
    className="border border-gray-400 rounded-md px-2 py-1"
    lang="vi"  // Adds the Vietnamese language attribute to the input element
  />
</div>

      <div className="flex justify-end mb-4">


        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleExportToExcel}
        >
          Xuất Excel
        </button>
      </div>
    </div>
  );
};

export default TransactionManual;
