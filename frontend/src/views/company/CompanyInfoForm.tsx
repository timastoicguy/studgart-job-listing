import React from 'react';

const CompanyInfoForm = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-8 border border-blue-400">
        {/* Header */}
        <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold">
          Thông tin công ty
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Logo and buttons */}
          <div className="flex flex-col items-center">
            <img
              src="/images/Right_Side_Image.webp"
              alt="Company Logo"
              className="w-28 h-28 rounded-full object-cover mb-4"
            />

            {/* Đổi logo và Xóa logo nằm cùng một hàng */}
            <div className="flex space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Đổi logo
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                Xóa logo
              </button>
            </div>

            {/* Đổi mật khẩu nằm riêng một hàng phía dưới */}
            <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-4">
              Đổi mật khẩu
            </button>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tên công ty */}
              <div className="col-span-2">
                <label className="block font-medium">
                  Tên công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="CA Advance"
                />
              </div>

              {/* Tên người đại diện */}
              <div>
                <label className="block font-medium">
                  Tên người đại diện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              {/* Hotline công ty */}
              <div>
                <label className="block font-medium">
                  Hotline công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="0987654321"
                />
              </div>

              {/* Email */}
              <div className="col-span-2">
                <label className="block font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="border rounded-md p-2 w-full bg-gray-100"
                  placeholder="nguyenvana@gmail.com"
                  disabled
                />
              </div>

              {/* Ngành nghề */}
              <div>
                <label className="block font-medium">Ngành nghề</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="Truyền thông"
                />
              </div>

              {/* Quốc gia */}
              <div>
                <label className="block font-medium">Quốc gia</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="Việt Nam"
                />
              </div>

              {/* Quy mô công ty */}
              <div className="col-span-2">
                <label className="block font-medium">Quy mô công ty</label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    className="border rounded-md p-2 w-1/2"
                    placeholder="Từ"
                  />
                  <input
                    type="number"
                    className="border rounded-md p-2 w-1/2"
                    placeholder="Đến"
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="col-span-2">
                <label className="block font-medium">Địa chỉ</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="Số 1, Võ Văn Ngân, TP. Thủ Đức, Việt Nam"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-4">
              <button className="bg-green-500 text-white px-6 py-2 rounded-md">
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoForm;
