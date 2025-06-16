// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";


// export function PreviewDialog({ attachmentPreview }) {
//   // eslint-disable-next-line react/prop-types
//   const isImage = attachmentPreview?.type === "image";
  
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Preview Attachment</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Attachment Preview</DialogTitle>
//           <DialogDescription>
//             Here is a preview of your attachment.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="py-4">
//           {isImage ? (
//             <img
//               // eslint-disable-next-line react/prop-types
//               src={attachmentPreview.src}
//               alt="Preview"
//               className="w-full h-auto"
//             />
//           ) : (
//             <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
//               <Viewer fileUrl={attachmentPreview.src} />
//             </Worker>
//           )}
//         </div>
//         <DialogFooter>
//           <Button onClick={() => {/* Close dialog logic here */}}>Close</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
