import { useState } from "react";
import { FiSidebar } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"; // Điều chỉnh đường dẫn nếu cần
import { roleOptions, MenuItem } from "./menuData"; // Import data từ menuData
import { NavLink } from "react-router-dom";

interface HeaderProps {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
  userData: {
    name: string;
    role: string;
  };
}

export default function Header({ showSideBar, setShowSideBar, userData }: HeaderProps) {
  const menuItems = roleOptions[userData.role] || [];

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
              src="..\public\images\logo.png" // Thay thế bằng đường dẫn logo của bạn
              alt="Logo"
              className="h-8"
            />
            <span className="ml-2 text-lg font-semibold text-green-500">
              STUDGART
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex justify-start items-start gap-8 text-black ">
          {menuItems.length > 0 && (
            <>
              <HoverDropdownMenu 
                link={menuItems[0]} 
                dropdownItems={menuItems.slice(1, 2)} // Lấy Dashboard và Settings
              />
              <HoverDropdownMenu 
                link={menuItems[2]} // Mục Account
                dropdownItems={menuItems[2].dropdownItems || []} // Đảm bảo dropdownItems không phải undefined
              />
            </>
          )}
        </div>

        {/* Right Section: Notification and Profile */}
        <div className="flex items-center gap-5 ">
          {/* Notification Bell */}
          <div className="relative">
            <button className="flex items-center justify-center w-8 h-8 text-black hover:text-green-500 transition-colors">
              <span className="relative">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  {/* SVG path cho biểu tượng chuông */}
                </svg>
                <span className="absolute top-0 right-0 block w-2.5 h-2.5 rounded-full bg-red-600"></span>
              </span>
            </button>
          </div>

          {/* Mini Profile */}
          <div className="flex items-center gap-3 right-10">
            <div className="flex flex-col text-right">
              <h2 className="text-md font-bold text-black">{userData.name}</h2>
              <span className="text-sm text-gray-500">{userData.role}</span>
            </div>
            <button className="bg-white rounded-full focus:ring-4 focus:ring-gray-300">
              <img
                className="w-10 h-10 rounded-full"
                src="/images/react.svg" // Thay thế bằng ảnh đại diện của người dùng nếu có
                alt="avatar"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component cho Hover Dropdown Menu
interface HoverDropdownMenuProps {
  link: MenuItem; // Thay đổi kiểu từ LinkItem thành MenuItem
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
            <DropdownMenuItem key={item.label} onClick={() => window.location.href = item.href || "#"}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
