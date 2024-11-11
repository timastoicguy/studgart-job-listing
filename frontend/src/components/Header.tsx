/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { FiSidebar } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"; // Adjust path as necessary
import { roleOptions, MenuItem } from "./menuData"; // Import data from menuData
import { NavLink } from "react-router-dom";
import socket from "@/store/socket";
import axios from "axios";
interface HeaderProps {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
  userData: { name: string; role: string } | null;
  onLogout: () => void;
}

export default function Header({ showSideBar, setShowSideBar, onLogout }: HeaderProps) {
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [badgeCount, setBadgeCount] = useState<number>(3); // Example count, replace with actual data
  
  useEffect(() => {
    // Get userData from localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      console.log(parsedData.role);  // Lấy giá trị role từ userData
    }
  }, []);

//   useEffect(() => {
//     const fetchDefaultQuestions = async () => {
//         const response = await axios.get("http://localhost:3000/api/chatbot-api");
//         setDefaultQuestions(response.data?.data);
//     };
//     fetchDefaultQuestions();
//     socket.emit('joinNotification', { userId: user?._id });
//     socket.on('notification', (content) => {

//         setChatMessages((prevMessages) => [...prevMessages,
//         { text: content?.text, isUser: false, sender: content?.sender }
//         ]);
//         setIsTyping(false);
//     });

//     return () => {
//         socket.off('newMessage');
//         socket.off("typing")
//     };

// }, []);

  if (!userData) {
    return null;  // You can add a loading state if needed
  }

  const menuItems = roleOptions[userData?.role] || []; // Lấy các menu items dựa trên role

  return (
    <div className="sticky w-full left-0 top-0 z-50">
      <div className="flex flex-row px-2 py-2.5 ml-0 bg-header justify-between items-center shadow-md">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <button
            className="flex w-8 h-8 lg:hidden rounded-md bg-white hover:bg-gray-100 hover:shadow-md justify-center items-center transition-all"
            onClick={() => setShowSideBar(!showSideBar)}
          >
            <span className="text-xl">
              <FiSidebar />
            </span>
          </button>
          <div className="flex items-center">
            <img
              src="..\public\images\logo.png" // Replace with your logo path
              alt="Logo"
              className="h-8"
            />
            <span className="ml-2 text-lg font-semibold text-green-500">
              STUDGART
            </span>
          </div>
        </div>

        <div className="lg:flex justify-start items-start gap-8 text-black">
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => (
              <HoverDropdownMenu 
                key={index}
                link={item}
                dropdownItems={item.dropdownItems || []}
              />
            ))
          ) : (
            <div>No menu items available</div> // Display if menuItems is empty
          )}
        </div>

        {/* Right Section: Notification and Profile */}
        <div className="flex items-center gap-5 ">
          {/* Notification Bell */}
          <div className="relative">
            <button
              className="flex items-center justify-center w-8 h-8 text-black hover:text-green-500 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="relative">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 24a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6v-5a6 6 0 0 0-12 0v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                {badgeCount > 0 && (
                  <span className="absolute top-0 right-0 block w-4 h-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                    {badgeCount}
                  </span>
                )}
              </span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4 border-b">
                  <span className="font-semibold">Thông báo</span>
                  <button className="text-green-500 float-right text-sm">Đánh dấu là đã đọc</button>
                </div>
                <div className="p-4">
                  <div className="text-sm mb-2">NAM, Vừa xem CV của bạn</div>
                  <div className="text-xs text-gray-500">31/10/2024</div>
                  <hr className="my-2" />
                  <div className="text-sm mb-2">NTD vừa đánh giá CV của bạn</div>
                  <div className="text-xs text-gray-500">31/10/2024</div>
                  <hr className="my-2" />
                  <div className="text-sm mb-2">Nhà tuyển dụng vừa xem CV ứng tuyển của bạn</div>
                  <div className="text-xs text-gray-500">31/10/2024</div>
                </div>
              </div>
            )}
          </div>

          {/* Avatar with Dropdown */}
          <div className="relative">
            <AvatarDropdownMenu userData={userData} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Avatar Dropdown Component
const AvatarDropdownMenu = ({ userData, onLogout }: { userData: any; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu>
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <DropdownMenuTrigger asChild>
          <button className="bg-white rounded-full focus:ring-4 focus:ring-gray-300">
            <img
              className="w-10 h-10 rounded-full"
              src="/images/react.svg" // Replace with user avatar if available
              alt="avatar"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuLabel>Thông tin tài khoản</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <NavLink to={`/jobseeker/profile/${userData?.id}`}>Thông tin cá nhân</NavLink>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}

// Component for Hover Dropdown Menu
interface HoverDropdownMenuProps {
  link: MenuItem;
  dropdownItems: MenuItem[];
}

function HoverDropdownMenu({ link, dropdownItems }: HoverDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <DropdownMenuTrigger asChild>
          <NavLink
            to={link.href || "#"}
            className="text-black font-medium hover:text-green-500 px-2 py-3 rounded-md"
          >
            {link.label}
          </NavLink>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{link.label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dropdownItems.map((item) => (
            <DropdownMenuItem key={item.label} onClick={() => window.location.href = item.href || "#"} >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
