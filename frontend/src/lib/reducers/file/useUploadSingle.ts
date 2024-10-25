import { useState } from 'react';
import axios from 'axios';

// Custom hook xử lý việc upload file
const useUploadSingle = () => {
  const [uploading, setUploading] = useState(false);  // trạng thái tải file
  const [uploadedUrl, setUploadedUrl] = useState<string>("");  // lưu URL file đã tải lên

  // Hàm upload file
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/upload/upload-single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Lưu URL file vào state
      setUploadedUrl(response.data.data.url);
      console.log(response.data.data.url);  // Log URL file đã upload
      alert('Tải lên thành công!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Đã có lỗi xảy ra trong quá trình tải file.');
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadedUrl, uploadFile };
};

export default useUploadSingle;
