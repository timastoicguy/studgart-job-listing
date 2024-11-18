/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/tablechecked";
import { FaSort, FaSearch } from "react-icons/fa";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axios from 'axios';
import AccountLockConfirmationModal from './AccountLockConfirmationModal';
import AccountActivateConfirmationModal from './AccountActivateConfirmationModal'; // New Modal for activation

const AccountAll = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]); // Account IDs
  const [accounts, setAccounts] = useState<any[]>([]); // Accounts data
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(5); // Items per page
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(10); // Total pages
  const [isLockModalOpen, setIsLockModalOpen] = useState(false); // Modal visibility for lock
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false); // Modal visibility for activate

  // Fetch accounts from API
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        params: {
          page: page,
          limit: limit,
          search: searchQuery, // Include the search query here
        },
      });
      const data = response.data.data;
      setAccounts(data.users); // Set account data
      setTotalPages(data.totalPages); // Set total pages for pagination
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Call fetchAccounts whenever page, limit, or searchQuery changes
  useEffect(() => {
    fetchAccounts();
  }, [page, limit, searchQuery]);

  const handleCheckboxChange = (id: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((accountId) => accountId !== id) : [...prev, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectedAccounts.length === accounts.length) {
      setSelectedAccounts([]); // Unselect all
    } else {
      setSelectedAccounts(accounts.map(account => account._id)); // Select all accounts
    }
  };

  // Lock selected accounts
  const handleLock = () => {
    setIsLockModalOpen(true); // Open the modal to confirm lock action
  };

  // Activate selected accounts
  const handleActivate = () => {
    setIsActivateModalOpen(true); // Open the modal to confirm activate action
  };

  // Handle page change in pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setCurrentPage(newPage);
  };

  return (
    <div className="px-2 py-4 md:px-4 rounded bg-white shadow-lg max-w-6xl mx-auto">
      <div className="mb-4 text-black">
        <h2 className="text-lg font-bold">Tài khoản</h2>
        <p className="mb-2">Đây là danh sách tài khoản</p>
        <div className="flex flex-col md:flex-row items-start mb-4">
          <div className="flex flex-col md:flex-row items-center">
            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">
              Show
            </label>
            <select
  id="itemsPerPage"
  className="border rounded-md ml-2 w-20 h-8"
  onChange={(e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "All") {
      setLimit(accounts.length); // Show all items
    } else {
      setLimit(Number(selectedValue)); // Set the selected limit (5, 10, 20)
    }
  }}
>
  <option value={5}>5</option>
  <option value={10}>10</option>
  <option value={20}>20</option>
</select>

            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">
              entries
            </label>
            <div className="relative ml-4 w-1/4">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="search"
                className="border border-gray-400 hover:border-blue-500 rounded-md pl-10 pr-4 py-1 h-8"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <div className="overflow-x-auto">
        <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[40px] text-black">
        <input
          type="checkbox"
          className="cursor-pointer"
          checked={selectedAccounts.length === accounts.length}
          onChange={handleSelectAllChange}
        />
      </TableHead>
      <TableHead className="w-[180px] text-black">
        <div className="flex justify-between items-center">
          Tên đăng nhập <FaSort />
        </div>
      </TableHead>
      <TableHead className="w-[180px] text-black">
        <div className="flex justify-between items-center">
          Vai trò <FaSort />
        </div>
      </TableHead>
      <TableHead className="w-[100px] text-black">
        <div className="flex justify-between items-center">
          Thời gian đăng ký <FaSort />
        </div>
      </TableHead>
      <TableHead className="w-[100px] text-black">
        <div className="flex justify-between items-center">
          Tên chủ tài khoản <FaSort />
        </div>
      </TableHead>
      <TableHead className="w-[60px] text-black">
        <div className="flex justify-between items-center">
          Trạng thái tài khoản <FaSort />
        </div>
      </TableHead>

    </TableRow>
  </TableHeader>
  <TableBody>
    {accounts.map((account) => (
      <TableRow key={account._id}>
        <TableCell>
          <input
            type="checkbox"
            checked={selectedAccounts.includes(account._id)}
            onChange={() => handleCheckboxChange(account._id)}
            className="cursor-pointer"
          />
        </TableCell>
        <TableCell>{account.email}</TableCell>
        <TableCell>{account.role}</TableCell>
        <TableCell>{new Date(account.createdAt).toLocaleDateString()}</TableCell>
        <TableCell>{account.username}</TableCell>
        <TableCell>{account.isActive ? "Active" : "Inactive"}</TableCell>

      </TableRow>
    ))}
  </TableBody>
</Table>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={handleLock}
        >
          Khóa
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleActivate}
        >
          Kích hoạt
        </button>
      </div>

      <AccountLockConfirmationModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        selectedAccounts={selectedAccounts}
        fetchAccounts={fetchAccounts}
      />

      <AccountActivateConfirmationModal
        isOpen={isActivateModalOpen}
        onClose={() => setIsActivateModalOpen(false)}
        selectedAccounts={selectedAccounts}
        fetchAccounts={fetchAccounts}
      />
      {/* Pagination */}
      <Pagination>
        <PaginationPrevious
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Trang trước
        </PaginationPrevious>

        <PaginationContent>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index} onClick={() => handlePageChange(index + 1)}>
              <PaginationLink
                isActive={index + 1 === currentPage}
                className={`px-3 py-1 rounded-md ${
                  index + 1 === currentPage ? "bg-blue-500 text-white" : "bg-white text-blue-500"
                }`}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>

        <PaginationNext
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Trang sau
        </PaginationNext>
      </Pagination>
    </div>
  );
};

export default AccountAll;
