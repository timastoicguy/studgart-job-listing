/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  FiMapPin,
  FiHeart,
  FiUsers,
  FiFlag,
  FiBriefcase,
  FiRefreshCcw,
} from "react-icons/fi";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"; // Importing Dialog components
import {
  fetchDetailJobData,
  fetchUserData,
} from "@/lib/reducers/jobseeker/jobDetail";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  Button,
  UploadFile,
  UploadProps,
  message,
  notification,
} from "antd"; // Importing UploadFile
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import useAuthStore from "@/store/auth/useAuthStore";


const DetailJob: React.FC = () => {
  const { userData, roleIDs } = useAuthStore(); // Truy cập thông tin người dùng từ store
  const { jobId } = useParams<{ jobId: string }>(); // Get jobId from URL
  const [title, setTitle] = useState("");
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(0);
  const [currency, setCurrency] = useState("");
  const [deadline, setDeadline] = useState("");
  const [jobDescription, setJobDescription] = useState(``);
  const [requirements, setRequirements] = useState(``);
  const [benefits, setBenefits] = useState(``);
  const [location, setLocation] = useState("");

  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("Null");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyAddress, setCompanyAddress] = useState("Null");
  const [industry, setIndustry] = useState("Null");
  const [companySize, setCompanySize] = useState("100-499 nhân viên");
  const [nationality, setNationality] = useState("Japan");

  const [coverLetter, setCoverLetter] = useState(""); // Đã thêm biến trạng thái cho coverLetter
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isApplied, setIsApplied] = useState(false);
  const [lastAppliedTime, setLastAppliedTime] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const handleApplyClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFileList([]); // Reset file list khi đóng dialog
    setCoverLetter(""); // Reset cover letter khi đóng dialog
  };

  const handleJobClick = (job: any) => {
    // Navigate to the job detail page, passing the job data as state
    navigate(`/jobseeker/detailjob/${job._id}`, { state: { job } });
  };

  const handleSubmitApplication = async () => {
    try {
      const formData = new FormData();
      if (fileList.length > 0) {
        formData.append("file", fileList[0].originFileObj); // Lấy tệp
      } else {
        throw new Error("No files selected.");
      }

      // Gửi yêu cầu upload tệp
      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload/upload-single`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Giả sử đường dẫn tệp trả về từ uploadResponse
      const resumeUrl = uploadResponse.data.data.url; // Cập nhật với thuộc tính chính xác từ phản hồi

      // Gửi yêu cầu ứng tuyển
      const applicationData = {
        job_id: jobId,
        job_seeker_id: roleIDs?.job_seeker_id,
        cover_letter: coverLetter, // Lấy giá trị từ textarea
        resume: resumeUrl, // Đường dẫn đã upload
        job_reviewer_id: "67273fea96599e898e7bbd6c",
        application_status: "pending",
      };
      const applicationResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications`,
        applicationData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Bạn đã ứng tuyển thành công");
      setIsApplied(true); // Cập nhật trạng thái ứng dụng sau khi thành công
      setLastAppliedTime(new Date().toLocaleString()); // Cập nhật thời gian ứng tuyển mới
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting application:", error);
      message.error(`Bạn ứng tuyển không thành công! ${error}`);
    }
  };

  const navigate = useNavigate();

  const handleCompanyClick = (companyId: any) => {
    // Navigate to the job detail page, passing the job data as state
    navigate(`/jobseeker/detailCompany/${companyId}`, { state: { companyId } });
  };

  useEffect(() => {
    const loadJobData = async () => {
      console.log(jobId);
      if (!jobId) return; // Check if jobId is available
      const response = await fetchDetailJobData(jobId);
      const response2 = await fetchUserData(response?.company.user_id || "");

      // Check if response contains data
      if (response) {

        // Set state with values from fetched data
        setTitle(response.title || "N/A");
        setSalaryMin(response.salaryRange?.min ?? 0);
        setSalaryMax(response.salaryRange?.max ?? 0);
        setCurrency(response.currency || "VNĐ"); // Ensure currency is set correctly
        setDeadline(response.applicationDeadline || "N/A"); // Ensure deadline is set correctly
        setJobDescription(response.description || "");

        // Process `requirements` and `benefits`
        setRequirements(
          Array.isArray(response.requirements)
            ? response.requirements.join("\n")
            : ""
        );
        setBenefits(
          Array.isArray(response.benefits) ? response.benefits.join("\n") : ""
        );

        // For `location`, which is now an array, access the first element
        setLocation(response.location?.[0]?.name || "N/A");
        setCompanyId(response.company?.["_id"] || "N/A");


        setCompanyName(response.company?.company_name || "N/A"); // Match the API structure
        setCompanyLogo(
          response2?.profilePicture || "https://via.placeholder.com/48"
        ); // Ensure logo is handled properly
        setCompanyAddress(response.company?.company_address || "N/A");
        setIndustry(response.company?.industry || "N/A"); // Ensure to match the API field if exists
        setCompanySize(response.company?.company_size || "N/A");
        setNationality(response.company?.nationality || "N/A"); // Ensure to match the API field if exists
      }
    };

    loadJobData();
  }, [jobId]); // Add jobId to dependencies

  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/applications?page=1&job_id=${jobId}&job_seeker_id=${
            userData.job_seeker_id
          }`
        );


        // Kiểm tra trong trường 'docs' thay vì toàn bộ 'response.data'
        if (response.data.data.docs && response.data.data.docs.length > 0) {
          console.log("response.data.data.docs[0]");
          setIsApplied(true);
          setLastAppliedTime(
            new Date(response.data.data.docs[0].applied_at).toLocaleString()
          ); // Sử dụng docs[0]
        } else {
          setIsApplied(false);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    if (jobId) {
      checkApplicationStatus();
    }
  }, [jobId]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchRelatedJobs = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/group/jobs/suggestions/?page=1&limit=3`
        );
        const jobs = response.data.data.jobs;
  
        // Fetch logos for each job
        const jobsWithLogos = await Promise.all(
          jobs.map(async (job: any) => {
            try {
              const companyResponse = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/companies/${job.company._id}`
              );
              const userId = companyResponse.data.data.user_id._id;

              const userResponse = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`
              );
              const logo = userResponse.data.data.profilePicture;
              return {
                ...job,
                company: {
                  ...job.company,
                  logo,
                },
              };
            } catch (err) {
              console.error("Error fetching company or user data:", err);
              return job; // Return the job without the logo if fetching fails
            }
          })
        );
  
        setRelatedJobs(jobsWithLogos); // Update state with jobs including logos
        setLoading(false);
      } catch (err) {
        setError("Error fetching related jobs.");
        setLoading(false);
      }
    };
  
    fetchRelatedJobs();
  }, []);

  const [fileList, setFileList] = useState<any[]>([]); // Thay đổi kiểu dữ liệu nếu cần

  const genCoverLetter = async () => {
    try {
      setLoading(true);
      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append("file", fileList[0].originFileObj);

        const apiResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/gen-cover-letter`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setCoverLetter(apiResponse?.data?.data);
      } else {
        notification.warning({
          message: "Tạo thư ngỏ",
          description: "Vui lòng đính kèm cv để có thể gen thử ngỏ từ cv.", // Mô tả thông báo
          placement: "topRight", // Vị trí hiển thị
        });
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };
  const uploadProps = {
    onChange: (info: any) => {
      // Cập nhật fileList khi có thay đổi
      setFileList(info.fileList);
    },
    beforeUpload: (file: any) => {
      // Ngăn không cho tệp tự động upload
      return false;
    },
  };
interface Favorite {
  job_id: {
    _id: string; // or the appropriate type for jobId
  };
}

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const jobSeekerId = roleIDs?.job_seeker_id;
        if (!jobSeekerId || !jobId) return;
        console.log("jobSeekerId", jobSeekerId);
        console.log("jobId", jobId);
  
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/favorites`,
          {
            params: { job_seeker_id: jobSeekerId, page: 1, limit: 200 },
          }
        );
        console.log("response.data?.data?.docs", response.data?.data?.docs);
  
        // Kiểm tra nếu jobId có trong danh sách các công việc yêu thích
        const isJobFavorite = response.data?.data?.docs.some(
          (favorite: Favorite) => favorite.job_id._id === jobId
        );
  
        setIsFavorite(isJobFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
  
    checkFavoriteStatus();
  }, [jobId, roleIDs?.job_seeker_id]);
  

  const toggleFavorite = async () => {
    try {
      console.log("isFavorite", isFavorite);
      const jobSeekerId = roleIDs?.job_seeker_id;
      if (!jobSeekerId || !jobId) return;
  
      if (isFavorite) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/favorites/${jobId}/${jobSeekerId}`, {
        });
        message.success("Đã xóa khỏi danh sách yêu thích.");
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/favorites`, {
          job_seeker_id: jobSeekerId,
          job_id: jobId,
          status: "saved",
        });
        message.success("Đã thêm vào danh sách yêu thích.");
      }
  
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      message.error("Không thể thực hiện thao tác yêu thích.");
    }
  };
  
  // Function to handle application button click
  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Center Column: Job Info and Job Details */}
        <div className="lg:col-span-2 bg-white p-6 rounded-md shadow-md space-y-6">
          {/* Section 1: Job Info */}
          <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
            Thông tin công việc
          </div>
          <div className="p-4 bg-white shadow rounded-md border">
            <div className="flex items-center justify-between mb-4">
              {/* Company Logo and Info */}
              <div className="flex items-center">
                <img
                  src={companyLogo || "https://via.placeholder.com/48"} // Use the company logo from state
                  alt="Company Logo"
                  className="w-20 h-20 mr-4"
                />
                <div>
                  <h2 className="text-lg font-bold">{title}</h2>
                  <p className="text-gray-600">{companyName}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiMapPin className="mr-1" />
                    {location}
                  </div>
                </div>
              </div>
              {/* Icons */}
              <div className="flex space-x-4">
              <Tooltip>
    <TooltipTrigger>
      <FiHeart
        size={24}
        color={isFavorite ? "red" : "gray"}
        onClick={toggleFavorite}
        style={{ cursor: "pointer" }}
      />
    </TooltipTrigger>
    <TooltipContent>
      {isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
    </TooltipContent>
  </Tooltip>
              </div>
            </div>
            <div className="pl-24">
              <p className="text-red-500 text-lg font-bold">
                {salaryMin.toLocaleString()} {currency} -{" "}
                {salaryMax.toLocaleString()} {currency}
              </p>


              <p className="text-gray-500 mt-2">
                Hết hạn: {new Date(deadline).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleApplyClick}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                {/* Thêm icon vào nút */}
                {isApplied ? (
                  <>
                    <FiRefreshCcw className="inline-block mr-2" /> Ứng tuyển lại
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="inline-block mr-2" /> Ứng tuyển
                  </>
                )}
              </button>
            </div>
            {isApplied ? (
              <span className="text-sm text-gray-600">
                Thời gian đã ứng tuyển: {lastAppliedTime}
              </span>
            ) : null}
          </div>

          {/* Section 2: Job Details */}
          <div className="p-4 bg-white shadow rounded-md border">
            <h3 className="font-bold">Chi tiết tuyển dụng</h3>

            <h4 className="font-bold mt-4">Mô tả công việc</h4>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {jobDescription}
            </p>

            <h4 className="font-bold mt-4">Yêu cầu ứng viên</h4>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {requirements}
            </p>

            <h4 className="font-bold mt-4">Quyền lợi</h4>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {benefits}
            </p>

            <h4 className="font-bold mt-4">Địa điểm làm việc</h4>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {location}
            </p>

            {/* Apply Button in Job Details Section */}
            <button
              onClick={handleApplyClick}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              {/* Thêm icon vào nút */}
              {isApplied ? (
                <>
                  <FiRefreshCcw className="inline-block mr-2" /> Ứng tuyển lại
                </>
              ) : (
                <>
                  <FaPaperPlane className="inline-block mr-2" /> Ứng tuyển
                </>
              )}
            </button>
          </div>
        </div>
        {/* Application Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="hidden" />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
              Đơn Ứng Tuyển
            </DialogTitle>
            <DialogDescription>
              <label className="block text-sm font-medium text-gray-700">
                Thư xin việc
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Viết thư xin việc của bạn ở đây"
                className="mt-1 block w-full border border-green-300 rounded-md p-2 min-h-40"
              />

              <label className="block text-sm font-medium text-green-700 mt-4">
                Tải lên tài liệu
              </label>
              <div>
                <div className="flex justify-start gap-2">
                  <Upload
                    {...uploadProps}
                    accept=".pdf" // Chỉ cho phép chọn tệp PDF
                    onChange={({ fileList }) => setFileList(fileList)} // Cập nhật danh sách tệp
                  >
                    <Button icon={<UploadOutlined />}>Tải lên CV</Button>
                  </Upload>

                  <Button
                    icon={<UploadOutlined />}
                    onClick={genCoverLetter}
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      "Tạo thư ngỏ"
                    )}
                  </Button>
                </div>
                {fileList.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Tệp đã chọn:</p>
                    <p>{fileList[0].name}</p>
                  </div>
                )}
              </div>
            </DialogDescription>
            <div className="mt-4 flex justify-end">
              <DialogClose asChild>
                <button className="mr-2 bg-gray-300 py-2 px-4 rounded-md">
                  Thoát
                </button>
              </DialogClose>
              <button
                onClick={handleSubmitApplication}
                className="bg-green-500 text-white py-2 px-4 rounded-md"
              >
                Gửi
              </button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Right Column: Company Info and Related Jobs */}
        <aside className="space-y-6">
          {/* Company Info */}
          <div className="bg-white p-6 rounded-md shadow-md border">
            <h2 className="text-lg font-bold mb-4 text-center">
              Thông tin công ty
            </h2>

            <div className="flex space-x-4 mb-4">
              <img
                src={companyLogo} // Sử dụng logo công ty từ state
                alt="Company Logo"
                className="w-16 h-16 object-cover"
              />
              <div>
                <h3 className="font-bold text-lg">{companyName}</h3>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FiBriefcase className="text-green-500" />{" "}
                    {/* Icon ngành nghề */}
                    <span>Ngành nghề:</span>{" "}
                    <span className="font-semibold">{industry}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FiUsers className="text-green-500" />{" "}
                    {/* Icon quy mô công ty */}
                    <span>Quy mô:</span>{" "}
                    <span className="font-semibold">{companySize}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FiFlag className="text-green-500" /> {/* Icon quốc tịch */}
                    <span>Quốc tịch:</span>{" "}
                    <span className="font-semibold">{nationality}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FiMapPin className="text-green-500" /> {/* Icon địa chỉ */}
                    <span>Địa chỉ:</span>{" "}
                    <span className="font-semibold">{location}</span>
                  </div>
                </div>
              </div>
            </div>

            <a
              className="text-green-500 text-center block font-semibold cursor-pointer"
              onClick={(e) => {
                e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
                handleCompanyClick(companyId); // Điều hướng khi click
              }}
            >
              Xem trang công ty
            </a>
          </div>

          {/* Related Jobs */}
          <div className="bg-white p-6 rounded-md shadow-md border">
    <h2 className="text-lg font-bold mb-4">Công việc liên quan</h2>
    <ul className="space-y-4">
      {relatedJobs.map((job, index) => (
        <li
          key={index}
          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md shadow-sm"
          onClick={() => handleJobClick(job)}
        >
          <img
            src={job.company?.logo || "https://via.placeholder.com/48"}
            alt={`${job.company?.company_name || "Company"} logo`}
            className="w-12 h-12 object-cover"
          />

          <div>
            <h3 className="font-bold">{job.title}</h3>
            <p className="text-gray-500 text-sm">
              {job.company?.company_name || "Company name not available"}
            </p>
            <p className="text-gray-500 text-sm">
              {job.location
                .map((loc: { name: string }) => loc.name)
                .join(", ")}
            </p>
            <p className="text-gray-500 text-sm">
              {job.technologies
                .map((tech: { name: string }) => tech.name)
                .join(", ")}
            </p>

            <p className="text-red-500 text-sm font-medium">
              {job.salaryRange
                ? `${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()} VND`
                : "Salary not disclosed"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </div>
        </aside>
      </div>
    </TooltipProvider>
  );
};

export default DetailJob;
