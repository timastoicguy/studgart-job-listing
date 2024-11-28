/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import PDFReviewModal from "./PDFReviewModal";
import { FaEye } from "react-icons/fa";
import { sendNotification } from "@/lib/reducers/recruiter/sendNotification";
import axios from "axios";

const Preview = ({ account, userId }: { account: any; userId: any }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleViewResume = (resumeLink: string) => {
    if (resumeLink) {
      console.log(resumeLink);
      setPdfUrl(resumeLink);
      setModalOpen(true);
    }
  };
  const handleReview = async (applicationId: string, userId: string) => {
    // Check if the application is already reviewed
    if (account.application_status === "reviewed"|| account.application_status === "accepted"|| account.application_status === "rejected") {
      console.log("Application is already reviewed, no action taken.");
      return;
    }
  
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications/${applicationId}`,
        {
          application_status: "reviewed",
        }
      );
  
      if (response.status === 200) {
        handleViewResume(response.data.data.resume);
  
        // Send notification after ensuring the status is updated
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
    //   <button
    //     className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    //     onClick={() => setModalOpen(true)}
    //   >
    //     Mở Modal
    //   </button>
    //   <PDFReviewModal
    //     isOpen={isModalOpen}
    //     onClose={() => setModalOpen(false)}
    //     pdfUrl="https://example.com/sample.pdf" // Thay bằng URL file PDF của bạn
    //   />

    <>
      <button
        className={`text-blue-500 hover:text-blue-700 mx-1 ${
          account.application_status === "reviewed"
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        onClick={() => handleReview(account._id, userId)}
      >
        <FaEye title="Xem" size={18} />
      </button>
      <PDFReviewModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        pdfUrl={pdfUrl} // Thay bằng URL file PDF của bạn
      />
    </>
  );
};

export default Preview;
