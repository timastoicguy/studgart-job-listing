/* eslint-disable @typescript-eslint/no-unused-vars */
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./views/auth/Login";
import MainLayout from "./components/MainLayout";
import About from "./views/auth/About";
import Register from "./views/auth/Register";
import PasswordReset from "./views/auth/PasswordReset";
import VerifyEmail from "./views/auth/VerifyEmail";
import ResetPassWord from "./views/auth/PasswordNew";

import PostJob from "./views/recruiter/PostJob";
import JobPosted from "./views/recruiter/JobPosted";
import JobPending from "./views/recruiter/JobPending";
import DetailJobHR from "./views/recruiter/DetailJob";
import JobReject from "./views/recruiter/JobReject";
import JobseekerPending from "./views/recruiter/JobseekerPending";

import Job from "./views/jobseeker/Jobs";
import DetailJob from "./views/jobseeker/DetailJob";
import DetailCompany from "./views/jobseeker/DetailCompany";
import FavoriteJobs from "./views/jobseeker/FavoriteJobs";
import InfoForm from "./views/share/InfoForm";


import CompanyInfoForm from "./views/company/CompanyInfoForm";
import LogoUpload  from "./views/company/LogoUpload";
import CompanyIdentity  from "./views/company/CompanyIdentity";
import AddCompanyIdentity  from "./views/company/AddCompanyIdentity";

import PaymentForm  from "./views/share/PaymentForm";
import PaymentRedirect  from "./views/share/PaymentRedirect";

import AdminDashboard from "./views/admin/Dashboard"; // Adjusted import for AdminDashboard
import AccountAll from "./views/admin/AccountAll"; // Adjusted import for AccountAll
import TransactionManual from "./views/admin/TransactionManual"; // Adjusted import for AccountAll
import useAuthStore from "./store/auth/useAuthStore";
import { useEffect } from "react";

function App() {


  return (
    <div className=" overflow-y-scroll"> {/* Sử dụng thanh cuộn tổng */}
      <Routes>
        <Route path="/" element={<Navigate to="/job" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path="/register" element={<Register />} />
        <Route path="/job" element={<About />} />
        <Route path="/auth/verify/:token" element={<VerifyEmail />} />
        <Route path="/auth/reset-password/:token" element={<ResetPassWord />} />
        <Route path="/about" element={<About />} />
        {/* Nesting MainLayout for main application routes */}
        <Route path="/" element={<MainLayout />}>


          <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Nested AdminDashboard */}
          <Route path="/admin/accountall" element={<AccountAll />} /> {/* Nested AccountAll */}
          <Route path="/admin/transactionmanual" element={<TransactionManual />} /> {/* Nested AccountAll */}

          <Route path="/recruiter/postjob" element={<PostJob />} />
          <Route path="/recruiter/jobposted" element={<JobPosted />} />
          <Route path="/recruiter/jobpending" element={<JobPending />} />
          <Route path="/recruiter/hrdetailjob" element={<DetailJobHR />} />
          <Route path="/recruiter/jobreject" element={<JobReject />} />
          <Route path="/recruiter/jobseekerpending/:jobId" element={<JobseekerPending />} />

          <Route path="/jobseeker/jobs" element={<Job />} />
          <Route path="/jobseeker/detailjob/:jobId" element={<DetailJob />} />
          <Route path="/jobseeker/detailCompany/:companyId" element={<DetailCompany />} />
          <Route path="/jobseeker/favoritejobs" element={<FavoriteJobs />} />

          <Route path="/company/info" element={<CompanyInfoForm />} />
          <Route path="/company/logoupload" element={<LogoUpload />} />
          <Route path="/company/companyidentity" element={<CompanyIdentity />} />
          <Route path="/company/addcompanyidentity" element={<AddCompanyIdentity />} />

          <Route path="/payment/:userId" element={<PaymentForm />} />
          <Route path="/payment" element={<PaymentRedirect />} />
          <Route path="/profile/:userId" element={<InfoForm />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
