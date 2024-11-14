/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "./ui/dropdown-menu"; // Adjust the import path as necessary
import { NavLink } from "react-router-dom";

// In your `menuData.ts`
interface MenuItem {
  name: string;
  href: string; // Ensure href is always a string
}

const menuData: MenuItem[] = [
  { name: "Home", href: "/home" },
  { name: "Profile", href: "/profile" },
  { name: "Logout", href: "/logout" },
];

interface AvatarDropdownMenuProps {
    userData: { id?: string; name: string; role: string }; // Make id optional
    onLogout: () => void;
  }
  
const AvatarDropdownMenu: React.FC<AvatarDropdownMenuProps> = ({ userData, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu>
      <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <DropdownMenuTrigger asChild>
          <button className="bg-white rounded-full focus:ring-4 focus:ring-gray-300">
            <img className="w-10 h-10 rounded-full" src="/images/react.svg" alt="avatar" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Thông tin tài khoản</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <NavLink to={`/jobseeker/profile/${userData.id}`}>Thông tin cá nhân</NavLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};

export default AvatarDropdownMenu;
