/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "./ui/dropdown-menu"; // Adjust the import path as necessary
import { NavLink } from "react-router-dom";
import axios from "axios";

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
  console.log("User data:", formData);
  useEffect(() => {
    if (userData?.id) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userData?.id}`)
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

        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [userData?.id]);

  return (
    <DropdownMenu>
      <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <DropdownMenuTrigger asChild>
          <button className="bg-white rounded-full focus:ring-4 focus:ring-gray-300">
            <img className="w-10 h-10 rounded-full" src={formData.profilePicture} alt="avatar" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Thông tin tài khoản</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <NavLink to={`/profile/${userData.id}`}>Thông tin cá nhân</NavLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};

export default AvatarDropdownMenu;
