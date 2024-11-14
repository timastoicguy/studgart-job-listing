/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import axios, { AxiosError } from 'axios';

// Custom hook xử lý việc upload file
const useUploadSingle = () => {
  const [uploading, setUploading] = useState(false);  // trạng thái tải file
  const [uploadedUrl, setUploadedUrl] = useState<string>("");  // lưu URL file đã tải lên

  // Hàm upload file
  const uploadFile = async (file: File) => {
    if (!file) {
      alert('Vui lòng chọn một tệp để tải lên.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/upload/upload-single', formData, {
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'multipart/form-data' // có thể không cần thiết
        }
      });

      // Lưu URL file vào state
      if (response.data && response.data.data) {
        setUploadedUrl(response.data.data.url);
        console.log('URL file đã upload:', response.data.data.url);  // Log URL file đã upload
        alert('Tải lên thành công!');
      } else {
        alert('Không nhận được URL từ phản hồi.');
      }
    } catch (error) {
      // Kiểm tra kiểu lỗi
      if (axios.isAxiosError(error)) {
        console.error('Upload failed:', error.response ? error.response.data : error.message);
        alert('Đã có lỗi xảy ra trong quá trình tải file: ' + (error.response ? error.response.data : error.message));
      } else {
        console.error('Upload failed:', error);
        alert('Đã có lỗi xảy ra trong quá trình tải file.');
      }
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadedUrl, uploadFile };
};

export default useUploadSingle;
