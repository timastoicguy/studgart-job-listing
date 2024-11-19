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
import { useParams } from "react-router-dom";
import { sendNotification } from "@/lib/reducers/recruiter/sendNotification";
import Preview from "./Prevew";

const JobseekerPending = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { jobId } = useParams<{ jobId: string }>(); // Get jobId from URL
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  console.log("jobId: ", accounts);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/applications`,
          {
            params: {
              page: page,
              limit: limit,
              application_status_sort: "asc",
              applied_at_sort: "asc",
              application_status: "",
              job_id: `${jobId}`,
            },
          }
        );
        setAccounts(response.data.data.docs);

        console.log("##########: ", accounts);
        setTotalPages(response.data.data.totalPages);
        // Gửi thông báo
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [page, limit]);

  const fetchUsername = async (userId: string) => {
    if (!userId || usernames[userId]) return; // Nếu đã có username hoặc không có userId, không gọi API
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`
      );
      const username = response.data.data.username || "Unknown";
      setUsernames((prev) => ({ ...prev, [userId]: username })); // Cập nhật state với username mới
    } catch (error) {
      console.error(`Error fetching username for userId ${userId}:`, error);
    }
  };

  // Gọi API lấy username khi accounts thay đổi
  useEffect(() => {
    accounts.forEach((account) => {
      const userId = account.job_seeker_id?.user_id;
      if (userId) fetchUsername(userId);
    });
  }, [accounts]);

  const handleAccept = async (applicationId: string, userId: string) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/applications/${applicationId}`,
        {
          application_status: "accepted",
        }
      );

      if (response.status === 200) {
        console.log("Application accepted");
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account._id === applicationId
              ? { ...account, application_status: "accepted" }
              : account
          )
        );
        await sendNotification(
          userId,
          "application_status",
          "Công ty XYZ đã chấp nhận hồ sơ của bạn."
        );
      } else {
        console.error("Error accepting application");
      }
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const handleReject = async (applicationId: string, userId: string) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/applications/${applicationId}`,
        {
          application_status: "rejected",
        }
      );

      if (response.status === 200) {
        console.log("Application rejected");
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account._id === applicationId
              ? { ...account, application_status: "rejected" }
              : account
          )
        );
        await sendNotification(
          userId,
          "application_status",
          `Công ty XYZ đã từ chối hồ sơ của bạn.`
        );
      } else {
        console.error("Error rejecting application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.job_seeker_id?._id
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false ||
      account.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
  );

  const handleViewResume = (resumeLink: string) => {
    if (resumeLink) {
      window.open(resumeLink, "_blank");
    } else {
      console.log("No resume link available.");
    }
  };
  const handleReview = async (applicationId: string, userId: string) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/applications/${applicationId}`,
        {
          application_status: "reviewed",
        }
      );

      if (response.status === 200) {
        handleViewResume(response.data.data.resume);
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account._id === applicationId
              ? { ...account, application_status: "reviewed" }
              : account
          )
        );
        await sendNotification(
          userId,
          "application_status",
          "Công ty XYZ đã xem xét hồ sơ của bạn."
        );
      } else {
        console.error("Error reviewing application");
      }
    } catch (error) {
      console.error("Error reviewing application:", error);
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
            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">
              Show
            </label>
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
                  Thời gian ứng tuyển <FaSort />
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-black">
                <div className="flex justify-between items-center">
                  Thời gian kết thúc <FaSort />
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
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Hiện tại chưa có người đăng ký
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account, index) => {
                const userId = account.job_seeker_id?.user_id;
                return (
                  <TableRow key={account._id}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>
                      {userId ? usernames[userId] || "Đang tải..." : "null"}
                    </TableCell>
                    <TableCell>{account.role || "null"}</TableCell>
                    <TableCell>
                      {account.applied_at
                        ? new Date(account.applied_at).toLocaleString("en-GB")
                        : "null"}
                    </TableCell>
                    <TableCell>
                      {account.job_id?.updatedDate
                        ? new Date(
                            account.job_id.updatedDate
                          ).toLocaleDateString("en-GB")
                        : "null"}
                    </TableCell>
                    <TableCell>
                      {account.application_status || "null"}
                    </TableCell>
                    <TableCell>
                      {/* <button
                        className={`text-blue-500 hover:text-blue-700 mx-1 ${
                          account.application_status === "reviewed"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleReview(account._id, userId)}
                        disabled={account.application_status === "reviewed"}
                      >
                        <FaEye title="Xem" size={18} />
                      </button> */}
                      <Preview account={account} userId={userId}></Preview>
                      <button
                        className={`text-green-500 hover:text-green-700 mx-1 ${
                          account.application_status === "accepted"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleAccept(account._id, userId)}
                        disabled={account.application_status === "accepted"}
                      >
                        <FaCheck title="Phù Hợp" size={18} />
                      </button>
                      <button
                        className={`text-red-500 hover:text-red-700 mx-1 ${
                          account.application_status === "rejected"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleReject(account._id, userId)}
                        disabled={account.application_status === "rejected"}
                      >
                        <FaTimes title="Từ Chối" size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
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
    </div>
  );
};

export default JobseekerPending;
