/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSort, FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
import ConfirmationDialog from "../component/ConfirmationDialog"; // Import the ConfirmationDialog component
import { notification } from 'antd';
import useAuthStore from "@/store/auth/useAuthStore";



interface Recruiter {
  _id: string;
  status: string;
  created_at: string;
  user: {
    _id: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    profilePicture: string;
    bio: string;
    isActive: boolean;
    isVerified: boolean;
  };
  company: {
    _id: string;
    company_size: string;
    company_name: string;
    contact_email: string;
    contact_phone: string;
    company_address: string;
  };
}

const CompanyIdentity = () => {
  const { userData,roleIDs } = useAuthStore(); // Lấy thông tin người dùng từ store
  const [accounts, setAccounts] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Recruiter | null>(null);
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const company_id = roleIDs?.company_id ?? null;
  console.log("Company ID:", roleIDs);
      if (!company_id) {
        console.error("Company ID not found in localStorage");
        setAccounts([]);
        setLoading(false);
        return;
      }
  
      const params: Record<string, any> = {
        page,
        limit,
        company_id,
      };
  
      if (searchTerm) {
        params.email = searchTerm;
      }
  
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/recruiters`,
        {
          params,
        }
      );
  
      const { data, totalPages } = response.data;
      setAccounts(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Call fetchAccounts in useEffect when dependencies change
  useEffect(() => {
    fetchAccounts();
  }, [page, limit, searchTerm]); // Keeps the page change logic as is
  
  

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
  };

  const removeEmployeeFromCompany = async (userId: string, recruiterId: string) => {
    try {
      const company_id = userData._id ?? null;

  
      if (!company_id) {
        console.error("Company ID not found in localStorage");
        return;
      }
  
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/recruiters/${recruiterId}`,
        {
          user_id: userId,
          company_id: null, 
        },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Employee removed from company:", response.data);
  
      // Hiển thị thông báo thành công khi xóa người tuyển dụng
      notification.success({
        message: 'Thành công',
        description: 'Nhân sự đã được xóa khỏi công ty.',
        placement: 'topRight', // Vị trí hiển thị thông báo
      });
    } catch (error) {
      console.error("Error removing employee from company:", error);
  
      // Hiển thị thông báo lỗi nếu có
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi xóa người tuyển dụng khỏi công ty.',
        placement: 'topRight', // Vị trí hiển thị thông báo
      });
    }
  };
  
  const handleAddEmployeeClick = () => {
    navigate("/company/addCompanyIdentity");
  };

  const handleDeleteClick = (account: Recruiter) => {
    setSelectedAccount(account); // Set the selected account
    setIsDialogOpen(true); // Show the dialog
  };
  const handleDialogConfirm = async () => {
    if (selectedAccount) {
      // Remove the employee from the company
      await removeEmployeeFromCompany(selectedAccount.user._id, selectedAccount._id);
      
      // Close the dialog
      setIsDialogOpen(false);
      setSelectedAccount(null); // Reset the selected account
      
      // Refetch accounts by manually calling fetchAccounts
      fetchAccounts(); // This will re-fetch the data immediately after deletion
    }
  };
  
  const handleDialogCancel = () => {
    setIsDialogOpen(false); // Close the dialog on cancel
    setSelectedAccount(null); // Reset the selected account
  };

  return (
    <div className="px-2 py-4 md:px-4 rounded bg-white shadow-lg max-w-6xl mx-auto">
      <div className="mb-4 text-black">
        <h2 className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Thông tin người tuyển dụng
        </h2>
        <p className="mb-2">Đây là danh sách người tuyển dụng của công ty bạn</p>
        <div className="flex flex-col md:flex-row items-start mb-4">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
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
            <div className="pl-4 md:ml-auto">
              <button
                className="bg-green-500 text-white p-2 rounded"
                onClick={handleAddEmployeeClick}
              >
                Thêm người tuyển dụng
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-black">STT</TableHead>
              <TableHead className="w-[180px] text-black">Tên người dùng</TableHead>
              <TableHead className="w-[180px] text-black">Email</TableHead>
              <TableHead className="w-[180px] text-black">SĐT</TableHead>
              {/* <TableHead className="w-[180px] text-black">Trạng thái</TableHead> */}
              <TableHead className="w-[100px] text-black">Xóa tài khoản</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Hiện tại chưa có người đăng ký
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account, index) => (
                <TableRow key={account._id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>{account.user.username || "N/A"}</TableCell>
                  <TableCell>{account.user.email || "N/A"}</TableCell>
                  <TableCell>{account.user.phone || "N/A"}</TableCell>
                  {/* <TableCell>{account.status || "N/A"}</TableCell> */}
                  <TableCell>
                    <button
                      className="text-red-500 hover:text-red-700 mx-1"
                      onClick={() => handleDeleteClick(account)}
                    >
                      <FaTimes title="Xóa tài khoản khỏi công ty" size={18} />
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
  onConfirm={handleDialogConfirm}
  onCancel={handleDialogCancel}
  message="Bạn có chắc chắn muốn xóa người tuyển dụng này?" // Add a custom message
/>

    </div>
  );
};

export default CompanyIdentity;
