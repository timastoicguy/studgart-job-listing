import React, { useState } from 'react';
import useUploadSinggle from '@/lib/reducers/file/useUploadSingle';

const LogoUpload = () => {
  const [file, setFile] = useState<File | null>(null);  // state để lưu file đã chọn
  const { uploading, uploadedUrl, uploadFile } = useUploadSinggle();  // sử dụng hook

  // Hàm xử lý khi người dùng chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Hàm xử lý khi nhấn nút tải ảnh lên
  const handleUpload = () => {
    if (file) {
      uploadFile(file);  // gọi hàm upload từ hook
    } else {
      alert('Vui lòng chọn một file');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" onChange={handleFileChange} />  {/* Input để chọn file */}
      <button 
        onClick={handleUpload} 
        className="mt-2 bg-blue-500 text-white p-2 rounded"
        disabled={uploading}  // disable button khi đang tải lên
      >
        {uploading ? 'Đang tải lên...' : 'Upload'}
      </button>

      {uploadedUrl && (
        <div className="mt-4">
          <p>Logo đã tải lên:</p>
          <img src={uploadedUrl} alt="Uploaded logo" className="mt-2 w-32 h-32 object-cover" />  {/* Hiển thị ảnh */}
        </div>
      )}
    </div>
  );
};

export default LogoUpload;
