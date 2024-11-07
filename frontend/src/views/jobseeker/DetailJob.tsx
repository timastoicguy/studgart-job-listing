/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { FiMapPin, FiHeart, FiUsers, FiFlag, FiBriefcase } from "react-icons/fi";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'; // Importing Dialog components
import { fetchDetailJobData } from "@/lib/reducers/jobseeker/jobDetail";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, Button, UploadFile, UploadProps, message } from 'antd'; // Importing UploadFile
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";


const DetailJob: React.FC = () => {
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
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [industry, setIndustry] = useState("");
const [companySize, setCompanySize] = useState("100-499 nhân viên");
const [nationality, setNationality] = useState("Japan");

const [coverLetter, setCoverLetter] = useState(""); // Đã thêm biến trạng thái cho coverLetter
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApplyClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFileList([]); // Reset file list khi đóng dialog
    setCoverLetter(""); // Reset cover letter khi đóng dialog
  };

  const handleSubmitApplication = async () => {
    try {
        const formData = new FormData();
        if (fileList.length > 0) {
            formData.append('file', fileList[0].originFileObj); // Lấy tệp
        } else {
            throw new Error("No files selected.");
        }
        
        // Gửi yêu cầu upload tệp
        const uploadResponse = await axios.post('http://localhost:3000/api/upload/upload-single', formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        });

        // Giả sử đường dẫn tệp trả về từ uploadResponse
        const resumeUrl = uploadResponse.data.data.url; // Cập nhật với thuộc tính chính xác từ phản hồi

        // Gửi yêu cầu ứng tuyển
        const applicationData = {
            job_id: "672786a596599e898e7bbdab",
            job_seeker_id: "67273fea96599e898e7bbd6c",
            cover_letter: coverLetter, // Lấy giá trị từ textarea
            resume: resumeUrl, // Đường dẫn đã upload
            job_reviewer_id: "67273fea96599e898e7bbd6c",
            application_status: "reviewed",
        };

        const applicationResponse = await axios.post('http://localhost:3000/api/applications', applicationData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        console.log("Application submitted successfully:", applicationResponse.data);
        message.success("Bạn đã ứng tuyển thành công");
        handleCloseDialog();

    } catch (error) {
        console.error("Error submitting application:", error);
        message.error(`Bạn ứng tuyển không thành công! ${error}`);
    }
};

const navigate = useNavigate();

const handleCompanyClick = (companyId: any) => {
  console.log("Company clicked:", companyId);
  // Navigate to the job detail page, passing the job data as state
  navigate(`/jobseeker/detailCompany/${companyId}`, { state: { companyId } });
};

useEffect(() => {
  const loadJobData = async () => {
    console.log(jobId);
    if (!jobId) return; // Check if jobId is available
    const response = await fetchDetailJobData(jobId);
    
    // Check if response contains data
    if (response) {
      console.log("Test: ", response.company); // Log company details for testing

      // Set state with values from fetched data
      setTitle(response.title || "N/A");
      setSalaryMin(response.salaryRange?.min ?? 0);
      setSalaryMax(response.salaryRange?.max ?? 0);
      setCurrency(response.currency || "VNĐ"); // Ensure currency is set correctly
      setDeadline(response.deadline || "N/A"); // Ensure deadline is set correctly
      setJobDescription(response.description || "");

      // Process `requirements` and `benefits`
      setRequirements(Array.isArray(response.requirements) ? response.requirements.join("\n") : "");
      setBenefits(Array.isArray(response.benefits) ? response.benefits.join("\n") : "");

      // For `location`, which is now an array, access the first element
      setLocation(response.location?.[0]?.name || "N/A");
      setCompanyId(response.company._id || "N/A"); // Match the API structure
      // Check and set company details
      console.log(response.company._id || "N/A"); // Match the API structure

      setCompanyName(response.company.company_name || "N/A"); // Match the API structure
      setCompanyLogo(response.company?.logo || "https://via.placeholder.com/48"); // Ensure logo is handled properly
      setCompanyAddress(response.company.company_address || "N/A");
      setIndustry(response.company.industry || "N/A"); // Ensure to match the API field if exists
      setCompanySize(response.company.company_size || "N/A");
      setNationality(response.company.nationality || "N/A"); // Ensure to match the API field if exists
    }
  };

  loadJobData();
}, [jobId]); // Add jobId to dependencies



const [fileList, setFileList] = useState<any[]>([]); // Thay đổi kiểu dữ liệu nếu cần

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
                src={companyLogo} // Use the company logo from state
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
      <FiHeart className="text-gray-500 hover:text-red-500 cursor-pointer" />
    </TooltipTrigger>
    <TooltipContent>Yêu thích</TooltipContent>
  </Tooltip>
            </div>
          </div>
            <div className="pl-24">
            <p className="text-red-500 text-lg font-bold">
            {salaryMin} {currency} - {salaryMax} {currency}
          </p>
          <p className="text-gray-400 mt-1">10 minutes ago</p>
          <p className="text-gray-500 mt-2">Hết hạn: {new Date(deadline).toLocaleDateString()}</p>
            </div>
          

            <div className="mt-4 flex justify-end">
      <button
        onClick={handleApplyClick}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
      >
        Ứng tuyển
      </button>
    </div>
    

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
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          >
            Ứng tuyển
          </button>
        </div>
      </div>
         {/* Application Dialog */}
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <button className="hidden" />
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Đơn Ứng Tuyển</DialogTitle>
                <DialogDescription>
                    <label className="block text-sm font-medium text-gray-700">Thư xin việc</label>
                    <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Viết thư xin việc của bạn ở đây"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />

                    <label className="block text-sm font-medium text-gray-700 mt-4">Tải lên tài liệu</label>
                    <div>
                    <Upload
                      {...uploadProps}
                      accept=".pdf" // Chỉ cho phép chọn tệp PDF
                      onChange={({ fileList }) => setFileList(fileList)} // Cập nhật danh sách tệp
                  >
                      <Button icon={<UploadOutlined />}>Tải lên CV</Button>
                  </Upload>
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
                        <button className="mr-2 bg-gray-300 py-2 px-4 rounded-md">Thoát</button>
                    </DialogClose>
                    <button onClick={handleSubmitApplication} className="bg-green-500 text-white py-2 px-4 rounded-md">Gửi</button>
                </div>
            </DialogContent>
        </Dialog>
      {/* Right Column: Company Info and Related Jobs */}
<aside className="space-y-6">
  {/* Company Info */}
  <div className="bg-white p-6 rounded-md shadow-md border">
    <h2 className="text-lg font-bold mb-4 text-center">Thông tin công ty</h2>

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
            <FiBriefcase className="text-green-500" /> {/* Icon ngành nghề */}
            <span>Ngành nghề:</span> <span className="font-semibold">{industry}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiUsers className="text-green-500" /> {/* Icon quy mô công ty */}
            <span>Quy mô:</span> <span className="font-semibold">{companySize}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiFlag className="text-green-500" /> {/* Icon quốc tịch */}
            <span>Quốc tịch:</span> <span className="font-semibold">{nationality}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiMapPin className="text-green-500" /> {/* Icon địa chỉ */}
            <span>Địa chỉ:</span> <span className="font-semibold">{companyAddress}</span>
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
      >
        <img
          src={job.logo}
          alt={`${job.company} logo`}
          className="w-12 h-12 object-cover"
        />
        <div>
          <h3 className="font-bold">{job.title}</h3>
          <p className="text-gray-500 text-sm">{job.company}</p>
          <p className="text-red-500 text-sm font-semibold">{job.salary}</p>
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
 // Sample data for related jobs
 const relatedJobs = [
  {
    title: "Software Engineer",
    company: "WATA Solutions",
    salary: "8,000,000 - 35,000,000 VND",
    logo: "https://via.placeholder.com/48",
  },
  {
    title: "Backend Developer",
    company: "Tech Innovators",
    salary: "10,000,000 - 40,000,000 VND",
    logo: "https://via.placeholder.com/48",
  },
  {
    title: "UI/UX Designer",
    company: "Design Hub",
    salary: "9,000,000 - 30,000,000 VND",
    logo: "https://via.placeholder.com/48",
  },
  {
    title: "Backend Developer",
    company: "Tech Innovators",
    salary: "10,000,000 - 40,000,000 VND",
    logo: "https://via.placeholder.com/48",
  },
  {
    title: "UI/UX Designer",
    company: "Design Hub",
    salary: "9,000,000 - 30,000,000 VND",
    logo: "https://via.placeholder.com/48",
  },
  {
    title: "UI/UX Designer",
    company: "Design Hub",
    salary: "9,000,000 - 30,000,000 VND",
    logo: "https://via.placeholder.com/48",
  },
  // Add more jobs as needed
];