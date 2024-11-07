/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/tablechecked";
import { FaSort, FaSearch } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useState } from "react";

const AccountAll = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);

  const accounts = [
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    { id: 1, name: "John Doe", role: "Admin", registrationDate: "2024-01-01", username: "john_doe", status: "Active" },
    { id: 2, name: "Jane Smith", role: "User", registrationDate: "2024-02-01", username: "jane_smith", status: "Inactive" },
    // Mock thêm các tài khoản khác
  ];

  const handleCheckboxChange = (id: number) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((accountId) => accountId !== id) : [...prev, id]
    );
  };

  const handleLock = () => {
    console.log("Locking accounts:", selectedAccounts);
  };

  const handleActivate = () => {
    console.log("Activating accounts:", selectedAccounts);
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
          />
        </div>
      </div>
    </div>
  </div>

  <div className=" overflow-auto"> {/* Chỉ cuộn khi cần */}
    <div className="overflow-x-auto"> {/* Cuộn ngang khi cần */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px] text-black">
              <input type="checkbox" className="cursor-pointer" onChange={() => {
                // Handle select all functionality here if needed
              }} />
            </TableHead>
            <TableHead className="w-[180px] text-black">
              <div className="flex justify-between items-center">
                Tên chủ tài khoản <FaSort />
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
                Tên đăng nhập <FaSort />
              </div>
            </TableHead>
            <TableHead className="w-[60px] text-black">
              <div className="flex justify-between items-center">
                Trạng thái tài khoản <FaSort />
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
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(account.id)}
                  onChange={() => handleCheckboxChange(account.id)}
                  className="cursor-pointer"
                />
              </TableCell>
              <TableCell>
                {account.name}
              </TableCell>
              <TableCell>
                {account.role}
              </TableCell>
              <TableCell>
                {account.registrationDate}
              </TableCell>
              <TableCell>
                {account.username}
              </TableCell>
              <TableCell>
                {account.status}
              </TableCell>
              <TableCell>
                <button className="text-blue-500 hover:underline">Edit</button>
              </TableCell>
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

  <Pagination>
    <PaginationPrevious>Previous</PaginationPrevious>
    <PaginationContent>
      <PaginationItem>
        <PaginationLink isActive={true}>1</PaginationLink>
      </PaginationItem>
      <PaginationEllipsis />
      <PaginationItem>
        <PaginationLink>2</PaginationLink>
      </PaginationItem>
    </PaginationContent>
    <PaginationNext>Next</PaginationNext>
  </Pagination>
</div>

  );
};

export default AccountAll;
