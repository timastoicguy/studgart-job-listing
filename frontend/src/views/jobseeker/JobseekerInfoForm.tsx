/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import axios, { AxiosError } from 'axios';
import { Upload, Button, UploadFile, UploadProps, message, Modal } from 'antd'; // Import Ant Design components
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';

const JobseekerInfoForm = () => {
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    address: '',
    bio: '',
    birthDate: undefined as Date | undefined,
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Hàm lấy dữ liệu người dùng từ API
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3000/api/users/${userId}`)
        .then(response => {
          if (response.data.data) {
            setFormData({
              name: response.data.data.username,
              phone: response.data.data.phone || '', 
              gender: response.data.data.gender || '',
              address: response.data.data.address || '',
              bio: response.data.data.bio || '',
              birthDate: response.data.data.birthDate ? new Date(response.data.data.birthDate) : undefined,
            });
          }
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu người dùng:', error));
    }
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    console.log(userId);
    try {
      const response = await axios.patch(`http://localhost:3000/api/jobseekers/${userId}`, {
        username: formData.name,
        bio: formData.bio,
      });
      console.log(response);
      if (response.data.error === null) {
        alert('Cập nhật thông tin thành công!');
        setIsEditing(false);
      } else {
        console.error('Lỗi khi cập nhật dữ liệu:', response.data.error);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API cập nhật:', error);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFormData(prevData => ({ ...prevData, birthDate: date }));
    setShowCalendar(false);
  };

  const uploadProps: UploadProps = {
    accept: ".pdf,.png,.jpeg",
    fileList,
    maxCount: 1,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
  
      // Lấy tệp đầu tiên
      const file = newFileList[0]?.originFileObj;
      if (file) {
        // Kiểm tra loại file và tạo URL xem trước hoặc link
        const fileUrl = URL.createObjectURL(file);
        if (file.type === "application/pdf") {
          setPreviewUrl(fileUrl); // Tạo URL xem trước cho PDF
        } else if (file.type.includes("image/png") || file.type.includes("image/jpeg")) {
          setPreviewUrl(fileUrl); // Tạo URL xem trước cho hình ảnh
        } else {
          setPreviewUrl(null); // Nếu không phải PDF hoặc ảnh, không tạo URL xem trước
        }
      }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
  
        const response = await axios.post("http://localhost:3000/api/upload/upload-single", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        onSuccess?.({}, file);
        message.success("Tải lên CV thành công!");
      } catch (error) {
        console.error("Lỗi khi tải lên CV:", error);
        onError?.(error as AxiosError);
        message.error("Tải lên CV thất bại!");
      }
    },
    onRemove: () => {
      setFileList([]); // Xóa file khỏi danh sách
      setPreviewUrl(null); // Đặt lại URL xem trước
    },
  };
  
  
  const handlePreview = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-8 border border-blue-400">
        <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Thông tin cá nhân
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="flex flex-col items-center">
            <img
              src="/images/Right_Side_Image.webp"
              alt="Company Logo"
              className="w-28 h-28 rounded-full object-cover mb-4"
            />
            <div className="flex space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Đổi avatar
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                Xóa logo
              </button>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-4">
              Đổi mật khẩu
            </button>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block font-medium">
                  User ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  value={userId} 
                  disabled
                />
              </div>

              <div>
                <label className="block font-medium">
                  Tên người đại diện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block font-medium">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-span-2">
                <label className="block font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="border rounded-md p-2 w-full bg-gray-100"
                  value="dung0916149123@gmail.com" 
                  disabled
                />
              </div>

              <div>
                <label className="block font-medium">Ngày sinh</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  value={formData.birthDate ? format(formData.birthDate, 'dd/MM/yyyy') : ''}
                  onClick={() => setShowCalendar(true)}
                  readOnly
                  placeholder="Chọn ngày sinh"
                />
                {showCalendar && (
                  <Calendar 
                    mode="single" 
                    selected={formData.birthDate} 
                    onSelect={handleDateSelect} 
                    className="absolute z-50 mt-2 bg-white shadow-lg rounded-md"
                  />
                )}
              </div>

              <div>
                <label className="block font-medium">Giới tính</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full"
                    value={formData.gender}
                    disabled
                  />
                )}
              </div>

              <div className="col-span-2">
                <label className="block font-medium">Bio</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-span-2">
                <label className="block font-medium">Địa chỉ</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              {/* Upload CV Section */}
              <div className="col-span-2">
          <label className="block font-medium">Tải lên CV</label>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Tải lên CV</Button>
          </Upload>
          {previewUrl && (
            <Button
              icon={<EyeOutlined />}
              className="mt-2"
              onClick={handlePreview}
            >
              Xem trước CV
            </Button>
          )}
        </div>

        <Modal
          open={isModalVisible}
          title="Xem trước CV"
          footer={null}
          onCancel={handleCloseModal}
        >
          {previewUrl && (
            <>
  {fileList[0]?.type === "application/pdf" ? (
    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
      Xem file PDF
    </a>
  ) : (
    <>

      <img
        src={previewUrl}
        alt="Xem trước ảnh"
        style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }} // Tăng maxHeight để ảnh to hơn
      />
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
        Xem ảnh trong tab mới
      </a>
    </>
  )}
</>

)}

        </Modal>
      </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-md"
                onClick={handleEdit}
              >
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </button>
              {isEditing && (
                <button 
                  className="bg-green-500 text-white px-6 py-2 rounded-md" 
                  onClick={handleSave}
                >
                  Lưu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default JobseekerInfoForm;
