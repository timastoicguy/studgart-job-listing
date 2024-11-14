/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postJob } from "@/lib/reducers/recruiter/jobService";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiSend, FiHeart, FiMapPin, FiTrash2 } from "react-icons/fi";
import { fetchRecommendedCompanies,Company } from "@/lib/reducers/recruiter/postJobs";





export default function JobListing() {
  const [title, setTitle] = useState("FRONT-END DEVELOPER");
  const [salaryMin, setSalaryMin] = useState(750);
  const [salaryMax, setSalaryMax] = useState(1200);
  const [currency, setCurrency] = useState("VNĐ");
  const [deadline, setDeadline] = useState("2025-12-14");
  const [jobDescription, setJobDescription] = useState(`
    - Understand requirements, analyze - design, build and optimize E-commerce products for the company.
    - Participate in the maintenance and upgrade of the website's features.
    - Write well designed, testable, efficient code; Create website layout/user interface by using standard HTML/CSS/JS practices.
    - Perform work as requested by the manager.`);
  const [requirements, setRequirements] = useState(`
    - Good command in English
    - Bachelor's degree in related field
    - Experience with PHP (Laravel, WordPress, CodeIgniter), knowledge of Bootstrap, Sass, ReactJS / NodeJS...is an advantage
    - Proficient in using MySQL/PostgreSQL/MariaDB for database administration
    - Master the knowledge and experience of HTML 5, CSS 3, JS`);
  const [benefits, setBenefits] = useState(`
    - Salary: Negotiable based on experience and track records
    - A friendly, dynamic and professional environment with great chances to learn new skills and gain valuable experience
    - Annual leave, insurance following Vietnam Law and company’s regulation (social insurance and health care insurance, etc.)
    - Periodic and regular evaluations for salary raises in accordance with performances.`);
  const [location, setLocation] = useState("HCM");
  const [companyId, setCompanyId] = useState("60df7992fc13ae1af000006c"); // Update with actual ObjectId
  const [jobCategoryId, setJobCategoryId] = useState("60df7992fc13ae1af000006d"); // Update with actual ObjectId
  const [recruiterId, setRecruiterId] = useState("60df7992fc13ae1af000006e"); // Update with actual ObjectId
  const [companyName, setCompanyName] = useState("CA Advance");
  const [companyLogo, setCompanyLogo] = useState("/path/to/company-logo.png");
  const [companyAddress, setCompanyAddress] = useState("Lầu 21, Centec Tower, 72-74 đường Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh");
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const availableSkills = ["JavaScript", "React", "Node.js", "CSS", "HTML"];

  const handleSubmit = async () => {
    const skillsToSend = skills.length > 0 ? skills.map(skill => ({ name: skill, code: skill.toUpperCase() })) : [{ name: "DEFAULT_SKILL", code: "DEFAULT" }];
    
    const jobData = {
      title: title.trim(),
      salaryRange: { min: salaryMin, max: salaryMax },
      currency,
      deadline,
      description: jobDescription,
      responsibilities: jobDescription.split("\n").filter(line => line.trim() !== ""),
      requirements: requirements.split("\n").filter(line => line.trim() !== ""),
      benefits: benefits.split("\n").filter(line => line.trim() !== ""),
      location: [{ name: location, code: "HCM" }],
      skills: ["skillsToSend"],
      employmentType: [{ name: "full-time", code: "FT" }],
      experienceLevel: [{ name: "entry", code: "JR" }],
      company: selectedCompany, // Gán companyId vào đây
      jobCategory: jobCategoryId, // Ensure this is a valid ObjectId
      recruiter: recruiterId, // Ensure this is a valid ObjectId
      technologies: skillsToSend,
    };
  
    console.log("Job Data:", JSON.stringify(jobData, null, 2)); // Log the job data
  
    try {
      const result = await postJob(jobData);
      console.log("Job posted successfully:", result);
      alert("Job posted successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Response:", error.response); // Log full response
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

    const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [recommendedCompanies, setRecommendedCompanies] = useState<Company[]>([]); // Array of companies
  useEffect(() => {
    const loadRecommendedCompanies = async () => {
      const data = await fetchRecommendedCompanies(); // Gọi API để lấy công ty

      if (data && Array.isArray(data.data)) {
        setRecommendedCompanies(data.data.map(item => item.company)); // Chỉ lấy đối tượng company
        console.log('Recommended Companies:', data.data); // In dữ liệu các công ty
      } else {
        console.error('Error: Invalid data structure', data); // Log lỗi nếu dữ liệu không hợp lệ
      }
    };

    loadRecommendedCompanies();
  }, []);
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
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Khoảng lương từ</label>
            <input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(Number(e.target.value))}
              className="w-full p-3 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">đến</label>
            <input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(Number(e.target.value))}
              className="w-full p-3 border rounded-md"
            />
          </div>
          <div>
          <label className="block text-sm font-semibold mb-1">Công ty</label>
          <select
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
        className="w-full p-3 border rounded-md"
      >
        <option value="">Chọn công ty</option>
        {recommendedCompanies.length > 0 ? (
          recommendedCompanies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.company_name}
            </option>
          ))
        ) : (
          <option value="">Không có công ty nào</option>
        )}
      </select>
          </div>
        </div>
        
        {/* Deadline */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Thời gian hết hạn</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Mô tả công việc</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={4}
          />
        </div>

        {/* Job Requirements */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Yêu cầu ứng viên</label>
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
          <label className="block text-sm font-semibold mb-1">Loại nhân viên</label>
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
          <label className="block text-sm font-semibold mb-1">Kinh nghiệm</label>
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
          <label className="block text-sm font-semibold mb-1">Địa điểm làm việc</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
        </div>
        <button  onClick={handleSubmit} 
        className="bg-green-500 text-white py-2 px-4 rounded-md">Đăng</button>
      </div>

      {/* Right Side - Job Preview */}
      <div className="p-6 bg-gray-50 shadow-md rounded-md border space-y-6">
      <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
      PREVIEW
      </div>
        {/* Section 1: Job Info and Company */}
        <div className="p-4 bg-white shadow rounded-md border">
          <div className="flex items-center justify-between mb-4">
            {/* Company Logo */}
            <div className="flex items-center">
              <img src={companyLogo} alt="Company Logo" className="w-16 h-16 mr-4" />
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
            {salaryMin} {currency} - {salaryMax} {currency}
          </p>
          <p className="text-gray-400 mt-1">10 minutes ago</p>

          <p className="text-gray-500 mt-2">Hết hạn: {deadline}</p>
        </div>

        {/* Section 2: Job Details */}
        <div className="p-4 bg-white shadow rounded-md border">
          <h3 className="font-bold">Chi tiết tuyển dụng</h3>

          <h4 className="font-bold mt-4">Mô tả công việc</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{jobDescription}</p>

          <h4 className="font-bold mt-4">Yêu cầu ứng viên</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{requirements}</p>

          <h4 className="font-bold mt-4">Quyền lợi</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{benefits}</p>
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
          <p className="text-sm text-gray-600 whitespace-pre-line">{location}</p>
          
        </div>
      </div>
    </div>
  );
}