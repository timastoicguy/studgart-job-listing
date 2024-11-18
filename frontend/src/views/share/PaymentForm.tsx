/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Radio, Button, message, Table, Upload } from "antd";
import type { RadioChangeEvent } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import useUploadSingle from "@/lib/reducers/file/useUploadSingle";

const PaymentForm = () => {
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<
  "transfer" | "momo"
>("transfer");
const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
const [accountBalance, setAccountBalance] = useState(250000); // Example account balance
const [userData, setUserData] = useState<any>(null); // Store user data
const { userId } = useParams<{ userId: string }>(); // Lấy userId từ URL params

const { uploading, uploadedUrl, uploadFile } = useUploadSingle(); // Sử dụng hook upload
const [selectedFile, setSelectedFile] = useState<File | null>(null); // File được chọn
const [isUploadConfirmed, setIsUploadConfirmed] = useState<boolean>(false); // State để xác nhận việc tải lên

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
};

const handleUpload = async () => {
  if (!selectedFile) {
    message.warning("Vui lòng chọn một tệp để tải lên.");
    return;
  }
  await uploadFile(selectedFile);
};

const handleConfirmUpload = () => {
  if (uploadedUrl) {
    setIsUploadConfirmed(true);
    message.success("Ảnh đã được xác nhận và tải lên thành công.");
  } else {
    message.warning("Vui lòng tải ảnh lên trước khi xác nhận.");
  }
};

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      if (data && data.data) {
        setUserData(data.data); // Set the user data
        setAccountBalance(data.data.balance); // Update account balance with data from API
      } else {
        message.error("Không thể tải thông tin người dùng.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      message.error("Đã xảy ra lỗi khi lấy dữ liệu.");
    }
  };

  fetchUserData();
}, []); // Run once when the component is mounted

const ranks = [
  { name: "BRONZE", symbol: "🥉" },
  { name: "SILVER", symbol: "🥈" },
  { name: "GOLD", symbol: "🥇" },
  { name: "PLATINUM", symbol: "🏆" },
  { name: "DIAMOND", symbol: "💎" },
];

const amounts = [20000,50000, 100000, 200000, 500000];

const handlePaymentOptionChange = (e: RadioChangeEvent) => {
  setSelectedPaymentOption(e.target.value as "transfer" | "momo");
};

const handleAmountSelect = (amount: number) => {
  setSelectedAmount(amount);
};

const handleConfirmPayment = async () => {

  if (!selectedAmount) {
    message.error("Vui lòng chọn số tiền cần thanh toán.");
    
    return;
  }
  if(selectedPaymentOption=='transfer'){
  const payload = {
    userId: userData?.id || userId,
    amount: selectedAmount,
    urlImage: uploadedUrl || "https://example.com/payment-proof.jpg", // Dữ liệu ảnh cần cập nhật
  };
  console.log("Payload:", payload);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/payments/manual`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200) {
      message.success("Thanh toán thành công!");
              // Reset lại các giá trị sau khi thanh toán
              setSelectedFile(null);
              setSelectedAmount(null);
              setIsUploadConfirmed(false);
    } else {
      message.error(response.data.message || "Đã xảy ra lỗi khi thanh toán.");
    }
  } catch (error: any) {
    console.error("Lỗi khi gửi dữ liệu thanh toán:", error);
    message.error(error.response?.data?.message || "Đã xảy ra lỗi khi thanh toán.");
  }}
  else {
    const payload = {
      userId: userData?.id || userId,
      amount: selectedAmount,
      info: "THANH TOÁN BẰNG MOMO", // Dữ liệu ảnh cần cập nhật
    };
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/momo`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        const redirectUrl = response.data.data.shortLink || response.data.data.payUrl;
  
        if (redirectUrl) {
          window.open(redirectUrl, "_blank"); // Mở tab mới với URL trả về
        } else {
          message.error("Không nhận được đường dẫn thanh toán.");
        }
  
        message.success("Thanh toán thành công!");
        // Reset lại các giá trị sau khi thanh toán
        setSelectedFile(null);
        setSelectedAmount(null);
        setIsUploadConfirmed(false);
      } else {
        message.error(response.data.message || "Đã xảy ra lỗi khi thanh toán.");
      }
  
  } catch (error: any) {
    console.error("Lỗi khi gửi dữ liệu thanh toán:", error);
    message.error(error.response?.data?.message || "Đã xảy ra lỗi khi thanh toán.");
  }
      }
    
};



  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center  bg-gray-100 lg:space-x-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8 border border-green-500">
        <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold mb-4 ">
          Thanh toán
        </div>

        {/* Account balance */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-green-700">
            Số tiền hiện có trong tài khoản:
          </label>
          <div className="font-semibold text-xl text-green-800">
            {accountBalance.toLocaleString()} VND
          </div>
        </div>

        {/* User Info */}
        {userData && (
          <div className="mb-6">
            <label className="block font-medium mb-2 text-green-700">
              Thông tin người dùng:
            </label>
            <div className="flex items-center mb-4">
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <div className="text-lg font-semibold">{userData.fullName}</div>
                <div className="text-sm text-green-600">{userData.email}</div>
                <div className="text-sm text-green-600">{userData.phone}</div>
              </div>
            </div>
          </div>
        )}

        {/* Rank and Symbol */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-green-700">
            Rank của bạn:
          </label>
          <div className="flex flex-wrap gap-4">
            {ranks
              .filter((rank) => rank.name === userData?.rank) // Lọc ra rank hiện tại của người dùng
              .map((rank, index) => (
                <div
                  key={index}
                  className="px-4 py-2 border border-green-300 rounded-md bg-green-50 text-center bg-green-200 border-green-500"
                >
                  <span className="text-xl">{rank.symbol}</span>{" "}
                  <span className="font-semibold">{rank.name}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Payment Option */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-green-700">
            Chọn phương thức thanh toán:
          </label>
          <Radio.Group
            value={selectedPaymentOption}
            onChange={handlePaymentOptionChange}
          >
            <Radio.Button
              value="transfer"
              className={`${
                selectedPaymentOption === "transfer"
                  ? "bg-green-900 text-white"
                  : "text-green-600"
              } hover:bg-green-500 border-green-600 focus:outline-none focus:ring-none`}
            >
              Chuyển khoản
            </Radio.Button>
            <Radio.Button
              value="momo"
              className={`${
                selectedPaymentOption === "momo"
                  ? "bg-green-900 text-white"
                  : "text-green-600"
              } hover:bg-green-500 border-green-600 focus:outline-none focus:ring-none`}
            >
              Momo
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-green-700">
            Chọn số tiền thanh toán:
          </label>
          <div className="flex flex-wrap gap-2">
            {amounts.map((amount) => (
              <Button
                key={amount}
                type={selectedAmount === amount ? "primary" : "default"}
                className={`${
                  selectedAmount === amount ? "bg-green-900" : ""
                } hover:bg-green-500`}
                onClick={() => handleAmountSelect(amount)}
              >
                {amount / 1000}k
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="mt-2 ml-2 ">
              <Upload
                beforeUpload={(file) => {
                  setSelectedFile(file);
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} loading={uploading} onClick={handleUpload}>
                  {uploading ? "Đang tải lên..." : "Tải ảnh lên"}
                  
                </Button>
              </Upload>
              {uploadedUrl && (
                <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                  Xem ảnh đã tải lên
                </a>
              )}
            </div>
          </div>
        </div>

        

        {/* Confirm Payment and QR Code */}
        <div className="flex items-center gap-4">
          <Button
            type="primary"
            block
            onClick={handleConfirmPayment}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Xác nhận thanh toán
          </Button>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8 border border-green-500">
        <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold mb-4 ">
          Thông tin người nhận
        </div>

        {/* Account balance */}
        <div className="mb-6">
          <img
            src="https://joblisting2024a.blob.core.windows.net/imgs/2c86c4c8-d428-45e2-b748-b7dc35f0aac5.jpg"
            alt=""
          />
        </div>
        <div className="mb-6">
          <label className="block font-medium mb-2 text-green-700">
            Thông tin người nhận:
          </label>
          <div className="flex items-center mb-4">
            <img
              src="https://joblisting2024a.blob.core.windows.net/imgs/12f3d72b-7025-494b-b695-72cac092417b.jfif"
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4"
            />

            <div>
              <div className="text-lg font-semibold">NGUYEN HUNG DUNG</div>
              <div className="text-sm text-green-600">STK: 0916149123</div>
              <div className="text-sm text-green-600">
                Nội dung :STUGART_[Số ĐT đăng kí] [Họ tên người gửi]{" "}
              </div>
            </div>
          </div>
          <div className="text-sm text-red-600">
            *Lưu ý nên chụp lại ảnh giao dịch thành công để có thể dễ dàng sử lý
            giao dịch cho quý khách.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
