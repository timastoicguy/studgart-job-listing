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
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "@/store/auth/useAuthStore";

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


const AvatarDropdownMenu: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const {userData, logout}  = useAuthStore();
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
  useEffect(() => {

    if (userData?._id) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userData?._id}`)
        .then((response) => {
          if (response.data.data) {
            setFormData({
              profilePicture: response.data.data.profilePicture || "/images/default_avatar.png",
              email: response.data.data.email || "",
              name: response.data.data.username || "",
              phone: response.data.data.phone || "",
              address: response.data.data.address || "",
              bio: response.data.data.bio || "",
              balance: response.data.data.balance || 0,
              rank: response.data.data.rank || "",
              diamonds: response.data.data.diamonds+response.data.data.freeDiamonds || 0,
              totalSpent: response.data.data.totalSpent || 0,
              transactions: response.data.data.transactions || [],
              freeDiamonds: response.data.data.freeDiamonds || 0,
            });
          }

        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [userData?._id]);
  const ranks = [
    { name: "BRONZE", symbol: "🥉" }, // Rank bronze
    { name: "SILVER", symbol: "🥈" }, // Rank silver
    { name: "GOLD", symbol: "🥇" }, // Rank gold
    { name: "PLATINUM", symbol: "🏆" }, // Rank platinum
    { name: "DIAMOND", symbol: "💎" }, // Top rank
  ];
  const userRank = ranks.find((r) => r?.name === formData?.rank); // Tìm rank phù hợp
 const handelLogOut = () => {
    logout();
    navigate('/job');
  }
  return (
    <DropdownMenu>
      <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <DropdownMenuTrigger asChild>
          <button className="bg-white rounded-full focus:ring-4 focus:ring-gray-300">
            <img className="w-10 h-10 rounded-full" src={formData.profilePicture} alt="avatar" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white rounded-md shadow-md min-w-[200px]">
          <DropdownMenuLabel>Thông tin tài khoản</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <NavLink to={`/profile/${userData?._id ?? ""}`}>Thông tin cá nhân</NavLink>

          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <span className="text-sm px-2">
      Rank: {userRank ? `${userRank.symbol} ${userRank.name}` : "Sắt"}
    </span>
          <br />

          <span className="text-sm px-2">Kim cương: {formData.diamonds}</span>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handelLogOut}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};

export default AvatarDropdownMenu;
