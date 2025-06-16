/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postJob } from "@/lib/reducers/recruiter/jobService";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiSend, FiHeart, FiMapPin, FiTrash2 } from "react-icons/fi";
import {
  fetchRecommendedCompanies,
  Company,
} from "@/lib/reducers/recruiter/postJobs";
import useAuthStore from "@/store/auth/useAuthStore";
import ConfirmationDialog from "../component/ConfirmationDialog";
import { min } from "date-fns";

const getRecruiterIdFromLocalStorage = (): string | null => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    const parsedData = JSON.parse(userData);
    return parsedData.recruiter_id || null; // Return user ID or null if not found
  }
  return null; // Return null if no userData in localStorage
};

const FormattedNumberInput = ({ value, onChange, className }: any) => {
  const [display, setDisplay] = useState("");

  // Cập nhật khi value bên ngoài thay đổi
  useEffect(() => {
    if (value === null || value === undefined) setDisplay("");
    else setDisplay(format(value));
  }, [value]);

  const format = (num: any) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleChange = (e: any) => {
    const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
    const number = raw === "" ? 0 : parseInt(raw, 10);
    setDisplay(format(raw));
    onChange(number); // gửi số thật
  };

  const handleKeyDown = (e: any) => {
    if (
      !(
        (e.key >= "0" && e.key <= "9") ||
        ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
          e.key
        )
      )
    ) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      value={display}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
};

export default function JobListing() {
  const { userData, roleIDs } = useAuthStore(); // Truy cập thông tin người dùng từ store
  const recruiterId = roleIDs?.recruiter_id || ""; // Lấy recruiter_id từ userData
  console.log("User Data:", userData);
  const [title, setTitle] = useState("FRONT-END DEVELOPER");
  const [salaryMin, setSalaryMin] = useState(3000000);
  const [salaryMax, setSalaryMax] = useState(6000000);
  const [currency, setCurrency] = useState("VNĐ");
  const [applicationDeadline, setApplicationDeadline] = useState(
    new Date("2025-12-14")
  );
  const [isUrgent, setIsUrgent] = useState(false);

  const [jobDescription, setJobDescription] = useState(`
  - Hiểu yêu cầu, phân tích - thiết kế, xây dựng và tối ưu hóa các sản phẩm thương mại điện tử cho công ty.
- Tham gia bảo trì và nâng cấp các tính năng của website.
- Viết code được thiết kế tốt, có thể kiểm thử, hiệu quả; Tạo giao diện người dùng/bố cục website bằng cách sử dụng các chuẩn HTML/CSS/JS.
- Thực hiện công việc theo yêu cầu của quản lý.`);
  const [requirements, setRequirements] = useState(`
    - Tiếng Anh tốt
- Bằng cử nhân chuyên ngành liên quan
- Có kinh nghiệm với PHP (Laravel, WordPress, CodeIgniter), hiểu biết về Bootstrap, Sass, ReactJS/NodeJS...là một lợi thế
- Thành thạo sử dụng MySQL/PostgreSQL/MariaDB để quản trị cơ sở dữ liệu
- Nắm vững kiến thức và kinh nghiệm về HTML 5, CSS 3, JS`);
  const [benefits, setBenefits] = useState(`
    - Mức lương: Thỏa thuận dựa trên kinh nghiệm và thành tích
- Môi trường làm việc thân thiện, năng động và chuyên nghiệp với nhiều cơ hội học hỏi các kỹ năng mới và tích lũy kinh nghiệm quý báu
- Nghỉ phép hằng năm, bảo hiểm theo Luật Việt Nam và quy định của công ty (bảo hiểm xã hội, bảo hiểm y tế, v.v.)
- Đánh giá định kỳ và thường xuyên để tăng lương theo hiệu suất làm việc.`);
  const [location, setLocation] = useState("HCM");
  const [companyId, setCompanyId] = useState("60df7992fc13cc1af000006c"); // Update with actual ObjectId
  const [jobCategoryId, setJobCategoryId] = useState(
    "60df7992fc13ae1af000006d"
  ); // Update with actual ObjectId

  const [companyName, setCompanyName] = useState("CA Advance");
  const [companyAddress, setCompanyAddress] = useState(
    "Lầu 21, Centec Tower, 72-74 đường Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh"
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const availableSkills = ["JavaScript", "React", "Node.js", "CSS", "HTML"];
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Cập nhật giá trị dạng Date từ input
    setApplicationDeadline(new Date(event.target.value));
  };

  const handleConfirm = async () => {
    setIsConfirmOpen(false); // Đóng dialog sau khi xác nhận
    await handleSubmit(); // Gọi hàm submit job
  };

  const handleCancel = () => {
    setIsConfirmOpen(false); // Đóng dialog khi hủy
  };

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true); // Mở dialog
  };

  const handleSubmit = async () => {
    const skillsToSend =
      skills.length > 0
        ? skills.map((skill) => ({ name: skill, code: skill.toUpperCase() }))
        : [{ name: "DEFAULT_SKILL", code: "DEFAULT" }];

    const jobData = {
      title: title.trim(),
      salaryRange: { min: salaryMin, max: salaryMax },
      currency,
      applicationDeadline,
      isUrgent, // Sử dụng giá trị từ state
      description: jobDescription,
      responsibilities: jobDescription
        .split("\n")
        .filter((line) => line.trim() !== ""),
      requirements: requirements
        .split("\n")
        .filter((line) => line.trim() !== ""),
      benefits: benefits.split("\n").filter((line) => line.trim() !== ""),
      location: [{ name: location, code: "HCM" }],
      skills: ["skillsToSend"],
      employmentType: [{ name: "full-time", code: "FT" }],
      experienceLevel: [{ name: "entry", code: "JR" }],
      company: selectedCompany || companyId,
      jobCategory: jobCategoryId,
      recruiter: recruiterId,
      technologies: skillsToSend,
    };

    try {
      const result = await postJob(
        jobData,
        selectedCompany,
        userData._id || ""
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      alert("Failed to post job!");
    }
  };

  const addSkill = () => {
    if (selectedSkill && !skills.includes(selectedSkill.toUpperCase())) {
      setSkills((prevSkills) => [...prevSkills, selectedSkill.toUpperCase()]);
      setSelectedSkill(""); // Clear selection
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prevSkills) => prevSkills.filter((s) => s !== skill));
  };
  const [employeeType, setEmployeeType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [recommendedCompanies, setRecommendedCompanies] = useState<Company[]>(
    []
  ); // Array of companies
  useEffect(() => {
    const loadRecommendedCompanies = async () => {
      const data = await fetchRecommendedCompanies(userData._id);
      console.log("Data:", data);

      if (data && Array.isArray(data.data)) {
        setRecommendedCompanies(data.data.map((item) => item.company));
        console.log("Recommended Companies:", data.data);
      } else {
        console.error("Error: Invalid data structure", data);
      }
    };

    loadRecommendedCompanies();
  }, [userData]);
  return (
    <div className="flex flex-col gap-8 p-8 md:flex-row justify-center">
      {/* Left Side - Language Selector and Input Fields */}
      <div className="p-6 bg-white shadow-md rounded-md border">
        <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Thêm công việc
        </div>

        {/* Job Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
        </div>

        {/* Salary Range */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Lương từ</label>
            <FormattedNumberInput
              value={salaryMin}
              onChange={setSalaryMin}
              className={"w-full p-3 border rounded-md"}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">đến</label>
            <FormattedNumberInput
              value={salaryMax}
              onChange={setSalaryMin}
              className={"w-full p-3 border rounded-md"}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Công ty</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="">Cá nhân</option>
              {recommendedCompanies
                .filter((item) => item) // Filter out null or undefined `company`
                .map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.company_name}
                  </option>
                ))}
              {recommendedCompanies.length === 0 && (
                <option value="">Không có công ty nào</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Nhu cầu tuyển
            </label>
            <select
              className="w-full p-3 border rounded-md"
              value={isUrgent ? "urgent" : "normal"}
              onChange={(e) => setIsUrgent(e.target.value === "urgent")}
            >
              <option value="normal">Tuyển bình thường</option>
              <option value="urgent">Tuyển gấp</option>
            </select>
          </div>
        </div>

        {/* Deadline */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">
            Thời gian hết hạn
          </label>
          <input
            type="date"
            value={applicationDeadline.toISOString().split("T")[0]} // Hiển thị giá trị theo định dạng YYYY-MM-DD
            onChange={handleDateChange}
            className="w-full p-3 border rounded-md"
          />
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">
            Mô tả công việc
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={4}
          />
        </div>

        {/* Job Requirements */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">
            Yêu cầu ứng viên
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={4}
          />
        </div>

        {/* Job Benefits */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Quyền lợi</label>
          <textarea
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={4}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Kỹ năng</label>

          <div className="flex items-center gap-2">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="flex-1 p-3 border rounded-md"
            >
              <option value="">Chọn kỹ năng</option>
              {availableSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            <button
              onClick={addSkill}
              className="bg-green-500 text-white py-2 px-4 rounded-md"
            >
              Thêm
            </button>
          </div>

          <h4 className="font-bold mt-4">Danh sách kỹ năng</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-gray-700"
              >
                <span className="mr-2">{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-gray-500 hover:text-red-300 transition" // Light red on hover
                >
                  <FiTrash2 className="w-4 h-4" /> {/* Trash Icon */}
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* New Field: Employee Type */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">
            Loại nhân viên
          </label>
          <select
            value={employeeType}
            onChange={(e) => setEmployeeType(e.target.value)}
            className="w-full p-3 border rounded-md"
          >
            <option value="">Chọn loại nhân viên</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* New Field: Experience Level */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">
            Kinh nghiệm
          </label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full p-3 border rounded-md"
          >
            <option value="">Chọn kinh nghiệm</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>
        </div>

        {/* Job Location */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">
            Địa điểm làm việc
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
        </div>
        <button
          onClick={handleOpenConfirm}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Đăng
        </button>
      </div>

      {/* Right Side - Job Preview */}
      <div className="p-6 bg-gray-50 shadow-md rounded-md border space-y-6">
        <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Bản xem trước
        </div>
        {/* Section 1: Job Info and Company */}
        <div className="p-4 bg-white shadow rounded-md border">
          <div className="flex items-center justify-between mb-4">
            {/* Company Logo */}
            <div className="flex items-center">
              <img
                src={"/images/logo.png"}
                alt="Company Logo"
                className="w-16 h-16 mr-4"
              />
              <div>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-gray-600">{companyName}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FiMapPin className="mr-1" />
                  {companyAddress}
                </div>
              </div>
            </div>
            {/* Icons */}
            <div className="flex space-x-4">
              <FiHeart className="text-gray-400 w-6 h-6" />
            </div>
          </div>
          <p className="text-red-500 text-lg font-bold">
            {Number(salaryMin).toLocaleString()} {currency} -{" "}
            {Number(salaryMax).toLocaleString()} {currency}
          </p>
          <p className="text-gray-400 mt-1">10 minutes ago</p>
          <p className="text-gray-500 mt-2">
            Hết hạn: {applicationDeadline.toDateString()}
          </p>{" "}
          {/* Hiển thị định dạng ngày đọc được */}
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
          {/* Display New Fields */}
          {/* Job Info... */}
          <h3 className="font-bold">Kỹ năng</h3>
          <ul className="text-gray-700">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>

          <h4 className="font-bold mt-4">Loại nhân viên</h4>
          <p className="text-sm text-gray-600">{employeeType}</p>

          <h4 className="font-bold mt-4">Kinh nghiệm</h4>
          <p className="text-sm text-gray-600">{experienceLevel}</p>

          <h4 className="font-bold mt-4">Địa điểm làm việc</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {location}
          </p>
        </div>
        <ConfirmationDialog
          isOpen={isConfirmOpen}
          message="Bạn sẽ tốn 2 diamond cho bài đăng này. Bạn có muốn tiếp tục ?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
