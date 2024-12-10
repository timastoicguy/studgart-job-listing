/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Upload, Button, UploadFile, UploadProps, message, Modal } from "antd"; // Import Ant Design components
import { UploadOutlined } from "@ant-design/icons";
import ChangePasswordModal from "./ChangePasswordModal";

const InfoForm = () => {
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profilePicture: "",
    email: "",
    name: "",
    phone: "",
    address: "",
    bio: "",
    balance: 0,
    rank: "",
    diamonds: 0,
    totalSpent: 0,
    transactions: [] as any[],
    freeDiamonds: 0,
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAvatarUploadVisible, setIsAvatarUploadVisible] = useState(false); // To manage avatar upload visibility
  const [avatar, setAvatar] = useState<string | null>(null); // Store the uploaded avatar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ranks = [
    { name: "BRONZE", symbol: "🥉" }, // Rank bronze
    { name: "SILVER", symbol: "🥈" }, // Rank silver
    { name: "GOLD", symbol: "🥇" }, // Rank gold
    { name: "PLATINUM", symbol: "🏆" }, // Rank platinum
    { name: "DIAMOND", symbol: "💎" }, // Top rank
  ];
  const currentRank = ranks.find((rank) => rank.name === formData.rank);

  // Fetch user data
  useEffect(() => {
    if (userId) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`)
        .then((response) => {
          if (response.data.data) {
            setFormData({
              profilePicture: response.data.data.profilePicture || "",
              email: response.data.data.email || "",
              name: response.data.data.username || "",
              phone: response.data.data.phone || "",
              address: response.data.data.address || "",
              bio: response.data.data.bio || "",
              balance: response.data.data.balance || 0,
              rank: response.data.data.rank || "",
              diamonds: response.data.data.diamonds || 0,
              totalSpent: response.data.data.totalSpent || 0,
              transactions: response.data.data.transactions || [],
              freeDiamonds: response.data.data.freeDiamonds || 0,
            });
          }
          console.log("User data:", response.data.data);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [userId, avatar]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`,
        {
          username: formData.name,
          bio: formData.bio,
        }
      );
      if (response.data.error === null) {
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        console.error("Error updating data:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const updateAvatarUrl = async (url: string) => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`;
    const requestData = {
      profilePicture: `${url}`,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar URL");
      }

      const data = await response.json();
      console.log("Avatar updated successfully", data);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  // Handle avatar upload visibility
  const toggleAvatarUpload = () => {
    setIsAvatarUploadVisible((prevState) => !prevState);
  };

  // Upload file properties
  const uploadProps: UploadProps = {
    accept: ".png,.jpeg",
    fileList,
    maxCount: 1,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);

      // Handle preview URL
      const file = newFileList[0]?.originFileObj;
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        setAvatar(fileUrl); // Save the avatar URL
        console.log("Avatar URL:", fileUrl);
      }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/upload/upload-single`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        onSuccess?.({}, file);

        const fileUrl = response.data.data.url;
        updateAvatarUrl(fileUrl);
        setPreviewUrl(fileUrl);
        setAvatar(fileUrl); // Save the avatar URL
        console.log("Avatar URL:", fileUrl);
        message.success("Avatar uploaded successfully!");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        onError?.(error as AxiosError);
        message.error("Avatar upload failed!");
      }
    },
    onRemove: () => {
      setFileList([]);
      setPreviewUrl(null);
      setAvatar(null); // Reset avatar on remove
    },
  };

  const handleAvatarClick = () => {
    setIsModalVisible(true); // Show modal when avatar is clicked
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const navigate = useNavigate(); // Initialize the navigation hook

  const handleRechargeClick = () => {
    navigate(`/payment/${userId}`); // Navigate to the recharge page when button is clicked
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-8 border border-blue-400">
        <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Thông tin cá nhân
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="flex flex-col items-center">
            {/* Avatar with clickable popup */}
            <img
              src={formData.profilePicture || "/images/Right_Side_Image.webp"} // Use avatar or default image
              alt="User Avatar"
              className="w-28 h-28 rounded-full object-cover mb-4 cursor-pointer"
              onClick={handleAvatarClick} // Show modal on avatar click
            />
            {/* Thêm nội dung dưới Avatar */}
            <div className="info-container mt-4 ">
              {/* Đoạn mã bố cục mới */}
              {/* Trường Rank */}
              <div>
                <label className="block font-medium">Rank</label>
                <div className="flex items-center border rounded-md p-2 bg-gray-100">
                  {currentRank ? (
                    <>
                      <span className="text-lg mr-2">{currentRank.symbol}</span>
                      <span>{currentRank.name}</span>
                    </>
                  ) : (
                    <span>Sắt</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Trường Balance */}
                <div>
                  <label className="block font-medium">Balance</label>
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full bg-gray-100"
                    value={formData.balance}
                    disabled
                  />
                </div>

                {/* Trường Diamonds */}
                <div>
                  <label className="block font-medium">Diamonds</label>
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full bg-gray-100"
                    value={formData.diamonds}
                    disabled
                  />
                </div>

                {/* Trường Total Spent */}
                <div>
                  <label className="block font-medium">Total Spent</label>
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full bg-gray-100"
                    value={formData.totalSpent}
                    disabled
                  />
                </div>

                {/* Trường Free Diamonds */}
                <div>
                  <label className="block font-medium">Free Diamonds</label>
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full bg-gray-100"
                    value={formData.freeDiamonds}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              {/* Avatar Modal */}
              {isModalVisible && (
                <Modal
                  visible={isModalVisible}
                  onCancel={handleCloseModal}
                  footer={null}
                  centered
                >
                  <div className="flex justify-center items-center">
                    <img
                      src={
                        formData.profilePicture ||
                        "/images/Right_Side_Image.webp"
                      }
                      alt="Avatar"
                      className="w-28 h-28 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    {/* Upload Avatar */}
                    {isAvatarUploadVisible && (
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                      </Upload>
                    )}
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={toggleAvatarUpload}
                    >
                      Change Avatar
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                      Delete Avatar
                    </button>
                  </div>
                </Modal>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
                onClick={() => setIsModalOpen(true)}
              >
                Đổi mật khẩu
              </button>

              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-md mt-4"
                onClick={handleRechargeClick}
              >
                Nạp Tiền
              </button>
            </div>
          </div>

          {/* Modal Component */}
          <ChangePasswordModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

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
                  value={formData.email}
                  disabled
                />
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

export default InfoForm;
