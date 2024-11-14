/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSort, FaSearch, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/tablechecked";

const JobseekerPending = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/applications`, {
          params: {
            page: page,
            limit: limit,
            application_status_sort: 'asc',
            applied_at_sort: 'asc',
            application_status: 'reviewed',
            job_id: '6727864f96599e898e7bbd9c',
          },
        });
        setAccounts(response.data.data.docs);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [page, limit]);

  const handleAccept = async (applicationId: string) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/applications/${applicationId}`,
        {
          application_status: 'accepted',
        }
      );

      if (response.status === 200) {
        console.log('Application accepted');
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account._id === applicationId
              ? { ...account, application_status: 'accepted' }
              : account
          )
        );
      } else {
        console.error('Error accepting application');
      }
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/applications/${applicationId}`,
        {
          application_status: 'rejected',
        }
      );

      if (response.status === 200) {
        console.log('Application rejected');
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account._id === applicationId
              ? { ...account, application_status: 'rejected' }
              : account
          )
        );
      } else {
        console.error('Error rejecting application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAccounts = accounts.filter((account) =>
    account.job_seeker_id._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewResume = (resumeLink: string) => {
    if (resumeLink) {
      window.open(resumeLink, '_blank');
    } else {
      console.log("No resume link available.");
    }
  };
  return (
    <div className="px-2 py-4 md:px-4 rounded bg-white shadow-lg max-w-6xl mx-auto">
      <div className="mb-4 text-black">
        <h2 className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Thông tin ứng viên
        </h2>
        <p className="mb-2">Đây là danh sách ứng viên</p>
        <div className="flex flex-col md:flex-row items-start mb-4">
          <div className="flex flex-row md:flex-row items-center">
            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">Show</label>
            <select
              id="itemsPerPage"
              className="border rounded-md ml-3 w-10 h-8"
              onChange={(e) => setLimit(parseInt(e.target.value))}
              value={limit}
            >
              <option value={4}>4</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">entries</label>
            <div className="relative ml-4 w-1/4">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="search"
                className="border border-gray-400 hover:border-blue-500 rounded-md pl-10 pr-4 py-1 h-8"
                placeholder="Search"
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
                <div className="flex justify-between items-center">STT <FaSort /></div>
              </TableHead>
              <TableHead className="w-[180px] text-black">
                <div className="flex justify-between items-center">Tên người dùng <FaSort /></div>
              </TableHead>
              <TableHead className="w-[180px] text-black">
                <div className="flex justify-between items-center">Email <FaSort /></div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div className="flex justify-between items-center">Thời gian ứng tuyển <FaSort /></div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div className="flex justify-between items-center">Thời gian kết thúc <FaSort /></div>
              </TableHead>
              <TableHead className="w-[60px] text-black">
                <div className="flex justify-between items-center">Trạng thái <FaSort /></div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div className="flex justify-between items-center">Hoạt động</div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">Đang tải dữ liệu...</TableCell>
              </TableRow>
            ) : (
              filteredAccounts.map((account) => (
                <TableRow key={account._id}>
                  <TableCell>{(page - 1) * limit + filteredAccounts.indexOf(account) + 1}</TableCell>
                  <TableCell>{account.job_seeker_id._id}</TableCell>
                  <TableCell>{account.role}</TableCell>
                  <TableCell>{`${new Date(account.applied_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC" })} ${new Date(account.applied_at).toLocaleDateString("en-GB")}`}</TableCell>
                  <TableCell>{new Date(account.job_id.updatedDate).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell>{account.application_status}</TableCell>
                  <TableCell>
                    <button className="text-blue-500 hover:text-blue-700 mx-1" onClick={() => handleViewResume(account.resume)}>
                      <FaEye title="Xem" size={18} />
                    </button>
                    <button className="text-green-500 hover:text-green-700 mx-1" onClick={() => handleAccept(account._id)}>
                      <FaCheck title="Phù Hợp" size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700 mx-1" onClick={() => handleReject(account._id)}>
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
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            >
              {"<"} Previous
            </PaginationPrevious>
            <PaginationContent>
              {page} / {totalPages}
            </PaginationContent>
            <PaginationNext
              onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
            >
              Next {">"}
            </PaginationNext>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default JobseekerPending;
