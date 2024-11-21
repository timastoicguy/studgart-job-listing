/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import CVReviewPage from "./CVReviewPage";
import Confetti from "react-confetti"; // Import react-confetti

// Giả sử bạn đã tạo các component của Shadcn UI
const ResultCV = ({
  isOpen,
  onClose,
  data,
  isCongratulation,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  isCongratulation: boolean;
}) => {
  console.log("Test",isCongratulation);
  return (
    <>
  
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Kết quả CV</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="flex flex-col h-[400px] border rounded overflow-y-auto">
          {isCongratulation && <Confetti />}
            <CVReviewPage data={data} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
  
};

export default ResultCV;
