import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="bg-gray-800 text-white py-8 relative z-50">
      <div className="container mx-auto px-4  ">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
            <p className="text-sm">
            Chúng tôi kết nối những tài năng hàng đầu với những cơ hội tuyệt vời. Dù bạn đang tìm kiếm công việc mơ ước hay ứng viên hoàn hảo, chúng tôi đều sẵn sàng hỗ trợ bạn.
            </p>
          </div>
          {/* Useful Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Danh sách công việc
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Theo dõi tại</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-xl hover:text-blue-500" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-xl hover:text-blue-400" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-xl hover:text-blue-600" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-xl hover:text-pink-500" />
              </a>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-sm text-center">
          <p>© {new Date().getFullYear()} YourCompany. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
