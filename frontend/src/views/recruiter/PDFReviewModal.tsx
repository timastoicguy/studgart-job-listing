/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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

import "@fontsource/dancing-script"; // Font viết tay
import "@fontsource/patrick-hand"; // Font viết tay khác

import axios from "axios";
import ResultCV from "./ResultCV";

// Giả sử bạn đã tạo các component của Shadcn UI
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

  const assessCV = async () => {
    try {
      if (cvData) {
        setModalOpen(true);
      } else {
        const response = await axios.get(pdfUrl, {
          responseType: "blob", // Để nhận dữ liệu ở định dạng tệp
        });

        // Tạo FormData
        const formData = new FormData();
        formData.append("file", response.data, "uploaded-file.pdf"); // Đặt tên tệp

        // Gửi FormData qua Axios
        const apiResponse = await axios.post(
          "http://localhost:3000/api/evaluate-cv-api",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("API Response:", apiResponse.data);
        setCvData(apiResponse.data.data);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const reAssessCV = async () => {
    try {
      const response = await axios.get(pdfUrl, {
        responseType: "blob", // Để nhận dữ liệu ở định dạng tệp
      });

      // Tạo FormData
      const formData = new FormData();
      formData.append("file", response.data, "uploaded-file.pdf"); // Đặt tên tệp

      // Gửi FormData qua Axios
      const apiResponse = await axios.post(
        "http://localhost:3000/api/evaluate-cv-api",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", apiResponse.data);
      setCvData(apiResponse.data.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Error uploading PDF:", error);
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
            {/* Phần xem trước PDF */}
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

            {/* Phần bên phải */}
            <div className="w-1/3 p-4 flex flex-col gap-3">
              {/* Nút đánh giá CV */}
              <div className="flex flex-col gap-4 mb-6">
                <button
                  className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                  onClick={() => {
                    assessCV();
                  }}
                >
                  Xem kết quả CV
                </button>
                <button
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  onClick={() => {
                    reAssessCV();
                  }}
                >
                  Đánh giá lại CV
                </button>
              </div>

              {/* Khung chat */}
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
      {
        <ResultCV
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          data={cvData}
        ></ResultCV>
      }
    </>
  );
};

export default PDFReviewModal;
