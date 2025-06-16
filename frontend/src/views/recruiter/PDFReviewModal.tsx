/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Spin, notification } from "antd"; // Import notification from antd
import "@ant-design/icons";

import "@fontsource/dancing-script"; // Font viết tay
import "@fontsource/patrick-hand"; // Font viết tay khác

import axios from "axios";
import ResultCV from "./ResultCV";

const PDFReviewModal = ({
  isOpen,
  onClose,
  pdfUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}) => {
  const [cvData, setCvData] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti

  const openNotification = (type: 'success' | 'error', message: string) => {
    notification[type]({
      message: type === 'success' ? 'Thành công' : 'Thất bại',
      description: message,
      placement: 'topRight',
      duration: 3,
    });
  };

  const assessCV = async () => {
    try {

      if (cvData) {
        setModalOpen(true);
      } else {
        const response = await axios.get(pdfUrl, {
          responseType: "blob",
        });

        const formData = new FormData();
        formData.append("file", response.data, "uploaded-file.pdf");

        const apiResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/evaluate-cv-api`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setIsLoading(true); // Set loading to true
        setCvData(apiResponse.data.data);
        setModalOpen(true);

        // Show success notification
        openNotification('success', 'CV của bạn đánh giá hoàn tất!');
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      // Show error notification
      openNotification('error', 'Đã xảy ra lỗi trong quá trình đánh giá. Vui lòng thử lại.');
    } finally {
      setIsLoading(false); // Set loading to false when done
    }
  };

  const reAssessCV = async () => {
    try {
      setIsLoading(true); // Set loading to true
      const response = await axios.get(pdfUrl, {
        responseType: "blob",
      });

      const formData = new FormData();
      formData.append("file", response.data, "uploaded-file.pdf");

      const apiResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/evaluate-cv-api`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCvData(apiResponse.data.data);
      console.log(apiResponse.data.data.score.totalScore);
      checkScore(apiResponse.data.data?.score?.totalScore);
      setModalOpen(true);

      // Show success notification
      openNotification('success', 'CV của bạn đã đánh giá lại hoàn tất!');

    } catch (error) {
      console.error("Error uploading PDF:", error);
      // Show error notification
      openNotification('error', 'Đã xảy ra lỗi trong quá trình đánh giá. Vui lòng thử lại.');
    } finally {
      setIsLoading(false); // Set loading to false when done
    }
  };
  useEffect(() => {
    console.log("Confetti state changed:", showConfetti);
  }, [showConfetti]); // Lắng nghe sự thay đổi của `showConfetti`

  const checkScore = (scoreString: string) => {
    const [score, total] = scoreString.split("/").map(Number);
    if ((score / total) * 100 > 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Đánh giá CV</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="flex">
            <div className="w-2/3 p-4 border-r border-gray-200">
              <Worker
                workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
              >
                <div className="h-[500px] overflow-auto border rounded">
                  {pdfUrl ? (
                    <Viewer fileUrl={pdfUrl} />
                  ) : (
                    <p className="text-center text-gray-500">
                      Không có file PDF nào để xem trước
                    </p>
                  )}
                </div>
              </Worker>
            </div>

            <div className="w-1/3 p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-4 mb-6">
                <button
                  className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                  onClick={assessCV}
                >
                  Xem kết quả CV
                </button>
                <button
                  className="w-full px-4 py-2 text-green-600 bg-white border-2 border-green-600 hover:bg-white-100"
                  onClick={reAssessCV}
                >
                  {isLoading ? <Spin /> : "Đánh giá lại CV"}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div
                  className="tex-xl"
                  style={{
                    fontFamily: '"Patrick Hand", cursive',
                  }}
                >
                  Tổng Điểm:{" "}
                </div>
                <div
                  className="flex flex-col  h-[140px] border rounded justify-center items-center text-5xl"
                  style={{
                    fontFamily: '"Patrick Hand", cursive',
                  }}
                >
                  <div>{cvData && cvData?.score?.totalScore}</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isModalOpen && (
        <ResultCV
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          data={cvData}
          isCongratulation={showConfetti}
        />
        
      )}

    </>
  );
};

export default PDFReviewModal;
