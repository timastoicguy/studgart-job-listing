/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiHeart, FiMapPin, FiTrash } from 'react-icons/fi';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Favorite, useFetchJobs } from '@/lib/reducers/jobseeker/useFetchJobs';
import { notification } from 'antd';
import ConfirmationDialog from '../component/ConfirmationDialog';
import useAuthStore from '@/store/auth/useAuthStore';


const FavoriteJobs: React.FC = () => {
  const { userData } = useAuthStore(); // Truy cập thông tin người dùng từ store

  const [currentFavertiedPage, setCurrentFavertiedPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Manage dialog open state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null); // Store selected job ID for confirmation
  const [favorites, setFavorites] = useState<Map<string, boolean>>(new Map()); // Map for favorite jobs
  const [updatedJobs, setUpdatedJobs] = useState<Favorite[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null); // Store selected job ID for confirmation


  const {
    favertiedJobs: jobListings,
    recommendedJobs,
    topCompanies,
    handleFavertiedPageChange,
    currentFavertiedPageJobs,
    totalFavertiedPagesJobs,
    loading,
  } = useFetchJobs(currentFavertiedPage);

  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Update the jobs list when jobListings is updated
    setUpdatedJobs(jobListings);
  }, [jobListings]); // Runs when jobListings changes

  useEffect(() => {
    // Always reset to page 1 when the component is mounted
    setCurrentFavertiedPage(1);
  }, []);

  // Handle job removal from favorites
  const handleRemoveFavoriteJob = (jobId: string, index: string) => {
    setSelectedJobId(jobId); // Lưu lại ID của công việc cần xóa
    setSelectedId(index); // Lưu lại ID của công việc cần xóa
    setIsDialogOpen(true); // Hiển thị dialog xác nhận
  };

  
  // Xử lý xác nhận xóa
  const confirmRemoveFavoriteJob = async () => {
    if (!selectedJobId) return;
    console.log("selectedJobId:", selectedJobId);
    console.log("AAAAAAAA:", userData.job_seeker_id);


    if (!userData) {
      notification.error({
        message: 'Lỗi người dùng',
        description: 'Không tìm thấy thông tin người dùng trong localStorage.',
        placement: 'topRight',
      });
      return;
    }

    try {
      // Gửi yêu cầu xóa công việc yêu thích
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/favorites/${selectedJobId}/${userData.job_seeker_id}`
      );

      // Loại bỏ công việc khỏi danh sách hiện tại mà không cần tải lại
      setUpdatedJobs((prevJobs) => prevJobs.filter((job) => job.id !== selectedId));

      notification.success({
        message: 'Đã xóa khỏi yêu thích!',
        description: 'Công việc đã được xóa khỏi danh sách yêu thích.',
        placement: 'topRight',
      });

      // Đóng dialog xác nhận
      setIsDialogOpen(false);
      setSelectedJobId(null);
    } catch (error) {
      console.error('Lỗi khi xóa công việc yêu thích:', error);
      notification.error({
        message: 'Lỗi hệ thống',
        description: 'Không thể xóa công việc khỏi danh sách yêu thích.',
        placement: 'topRight',
      });
      setIsDialogOpen(false);
    }
  };

  // Hủy xóa công việc
  const cancelRemoveFavoriteJob = () => {
    setSelectedJobId(null); // Bỏ ID công việc cần xóa
    setIsDialogOpen(false); // Đóng dialog
  };

  return (
    <TooltipProvider>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        message={favorites.get(selectedJobId || "") ? "Bạn có muốn xóa bỏ công việc này khỏi danh sách yêu thích?" : "Do you want to favorite this job?"}
        onConfirm={confirmRemoveFavoriteJob}
        onCancel={cancelRemoveFavoriteJob}
      />
      <div className="lg:pl-[250px] flex flex-col md:flex-row bg-gray-100">
        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
              Danh sách công việc đã lưu
            </div>

            <div className="space-y-4 overflow-y-auto">
              {updatedJobs.slice(0, itemsPerPage).map((job) => (
                <div
                  key={job.id}
                  className="p-4 border rounded-md flex flex-col sm:flex-row sm:min-w-[500px] justify-between items-start bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex space-x-4 flex-1">
                        <img
                          src={job.avatar || "https://via.placeholder.com/48"}
                          alt="company logo"
                          className="w-20 h-20 object-cover rounded-full"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-center space-x-2 mb-1">
                            {job.isHot && (
                              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                                Tuyển gấp
                              </span>
                            )}
                            {job.isNew && (
                              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                Mới
                              </span>
                            )}
                          </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <h3 className="font-bold text-lg truncate max-sm:max-w-[150px] max-w-full flex items-center cursor-pointer">
                            {job.title}
                          </h3>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>{job.title}</span>
                        </TooltipContent>
                      </Tooltip>
                      <p className="text-gray-600">{job.techStack}</p>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <FiMapPin className="text-gray-500" />
                        <span>{job.location}</span> {/* Assuming the first location is the main one */}
                        <span>- {job.timePosted}</span>
                      </div>
                      <div className="text-red-500 font-semibold mt-1">
                            {job.salary}
                          </div>
                      <hr className="col-span-3 border-t border-gray-300 my-1" />
                      {/* <div className={`font-semibold mt-1 ${job.status === "Đã ứng tuyển" ? "text-blue-500" : "text-gray-500"}`}>
                        {job.status}
                      </div> */}
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center max-sm:w-full space-x-2 sm:space-y-2 mt-4 sm:mt-0 justify-end">
                    <Tooltip>
                      <TooltipTrigger>
                        <button 
                        onClick={() => handleRemoveFavoriteJob(job.id_job,job.id)}
                        className="bg-slate-300 text-black px-4 py-2 rounded-md flex items-center">
                          <FiTrash className="mr-2" /> Bỏ lưu
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Bỏ lưu</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
            <Pagination>
  <PaginationPrevious
    onClick={() => handleFavertiedPageChange(Math.max(currentFavertiedPageJobs - 1, 1))}
  >
    Trang trước
  </PaginationPrevious>

  <PaginationContent>
    {Array.from({ length: totalFavertiedPagesJobs }, (_, i) => (
      <PaginationItem key={i}>
        <PaginationLink
          isActive={currentFavertiedPageJobs === i + 1}
          onClick={() => {
            handleFavertiedPageChange(i + 1);
            setCurrentFavertiedPage(i + 1); // Correctly set the current page
          }}
          className={currentFavertiedPageJobs === i + 1 ? "bg-blue-500 text-white" : "bg-transparent text-black"}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    ))}
  </PaginationContent>

  <PaginationNext
    onClick={() => handleFavertiedPageChange(Math.min(currentFavertiedPageJobs + 1, totalFavertiedPagesJobs))}
  >
    Trang sau
  </PaginationNext>
</Pagination>

            </div>
          </div>
        </main>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-md border">
            <h2 className="text-lg font-bold mb-4">Các công việc có thể bạn quan tâm</h2>
            <div className="space-y-4">
              {recommendedJobs.map((job, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-2 border rounded-md hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={job.avatar}
                    alt="company logo"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-sm">{job.title}</h3>
                    <p className="text-gray-600">{job.techStack}</p>
                    <p className="text-gray-600 flex items-center">
                      <FiMapPin className="mr-1" /> {job.location}
                    </p>
                    <span className="text-sm text-red-500">{job.salary}</span>
                  </div>
                </div>
              ))}
            </div>
            <hr className="col-span-3 border-t border-gray-300 my-4" />
            <h2 className="text-lg font-bold mt-6 mb-4">Các công ty hàng đầu</h2>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-2 border rounded-md hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={company.avatar}
                    alt="company logo"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-sm">{company.name}</h3>
                    <p className="text-gray-600">{company.location}</p>
                    <p className="text-sm text-gray-600">Mở {company.openings} vị trí</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </TooltipProvider>
  );
};

export default FavoriteJobs;
