/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { FiSidebar } from "react-icons/fi";
// Adjust path as necessary
import { roleOptions, MenuItem as RoleMenuItem } from "./menuData"; // Import menu data and alias MenuItem for clarity
import socket from "@/store/socket"; // Ensure socket is configured correctly
import axios from "axios";
import AvatarDropdownMenu from "./AvatarDropdownMenu"; // Import AvatarDropdownMenu component
import HoverDropdownMenu from "./HoverDropdownMenu"; // Import HoverDropdownMenu component
import { useParams } from "react-router-dom";
import useAuthStore from "@/store/auth/useAuthStore";

const url_base = `${import.meta.env.VITE_API_BASE_URL}`;
interface HeaderProps {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
}

// Define MenuItem type for the menu
// menuData.ts

export interface MenuItem {
  name: string; // Add this line to include 'name' property
  label: string;
  action?: () => void;
  href?: string;
  dropdownItems?: MenuItem[];
}

// The rest of the code remains the same

export default function Header({
  showSideBar,
  setShowSideBar,
}: HeaderProps) {
  const { userData } = useAuthStore(); // Truy cập thông tin người dùng từ store
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef(null);
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
  useEffect(() => {
    // Fetch user data from localStorage
    console.log("header", userData)
    fetchNotifications();

    socket.emit("joinNotification", { userId: userData?._id });
    socket.on("notification", (data) => {
      setNotifications((prevNotifications) => [data, ...prevNotifications]);
      console.log("Notification received:", data);
      setBadgeCount((prev) => prev + 1); // Increment badge count for new notifications
      // Check if the audio file exists and log its path
      const audioPath = "/audio/notification.mp3"; // Path to your audio file
      console.log("Audio file path:", audioPath);

      // Check if the audio file is loading
      const audio = new Audio(audioPath);
      audio.onloadstart = () => {
        console.log("Audio file started loading...");
      };
      audio.onerror = (error) => {
        console.error("Error loading audio file:", error);
      };

      // Play sound notification
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${url_base}/api/notifications/${userData?._id}?page=${page}&limit=10`
      );
      const newNotifications = response.data.notifications.docs;

      // if (response.data.success) {
      //   setNotifications(response.data.notifications.docs);
      //   setBadgeCount(
      //     response.data.notifications.docs.filter((n: any) => !n.isRead).length
      //   );
      // }

      if (newNotifications.length === 0) {
        setHasMore(false); // No more notifications
      } else {
        setNotifications((prev) => [...prev, ...newNotifications]);
        setBadgeCount(newNotifications.filter((n: any) => !n.isRead).length);

        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle scroll event
  const handleScroll = () => {
    const container: any = scrollRef.current;
    if (!container) return;

    if (
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 10
    ) {
      fetchNotifications();
    }
  };

  useEffect(() => {

    if (userData?._id) {

      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userData?._id}`)
        .then((response) => {
          console.log("userData", response);
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
  }, [userData?._id]);

  const markAllAsRead = async () => {
    try {
      await axios.put(`/api/notifications/markAsRead`, {
        userId: userData?.id,
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
      setBadgeCount(0); // Reset the badge count after marking all as read
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await axios.patch(`${url_base}/api/notification/${notificationId}`, {
        isRead: true,
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setBadgeCount((prev) => prev - 1); // Decrease badge count when a notification is marked as read
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // if (!userData) {
  //   return null; // Return null if no user data is found
  // }

  return (
    <div className="sticky w-full left-0 top-0 z-50">
      <div className=" fixed w-full flex flex-row px-2 py-2.5 ml-0 bg-header justify-between items-center shadow-md">
        {/* Logo and Sidebar Toggle */}
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
            <img src="..\images\logo.png" alt="Logo" className="h-8" />

            <span className="ml-2 text-lg font-semibold text-green-500">
              STUDGART
            </span>
          </div>
        </div>

        {/* Navigation and Menu */}
        <div className="lg:flex justify-start items-start gap-8 text-black">
          {/* Dynamically rendered menu items */}
          {roleOptions[userData?.role]?.map((item, index) => (
            <HoverDropdownMenu
              key={index}
              link={item}
              dropdownItems={item.dropdownItems || []}
            />
          ))}
        </div>

        {/* Notification and Profile */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <button
              className="flex items-center justify-center w-8 h-8 text-black hover:text-green-500 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="relative">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 24a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6v-5a6 6 0 0 0-12 0v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                {badgeCount > 0 && (
                  <span className="absolute top-0 right-0 block w-4 h-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                    {badgeCount}
                  </span>
                )}
              </span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4 border-b flex justify-between">
                  <span className="font-semibold">Thông báo</span>
                  <button
                    className="text-green-500 text-sm "
                    onClick={markAllAsRead}
                  >
                    Đánh dấu là đã đọc
                  </button>
                </div>
                <div
                  className=" max-h-64 overflow-y-auto"
                  ref={scrollRef}
                  onScroll={handleScroll}
                >
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 ${
                          notification.isRead
                            ? "bg-white text-black"
                            : "bg-gray-100 text-black"
                        } border-b border-gray-200 text-sm`}
                        onClick={() =>
                          !notification.isRead &&
                          markNotificationAsRead(notification._id)
                        }
                      >
                        {notification.content}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2 text-gray-500">
                      Không có thông báo nào
                    </div>
                  )}
                  {loading && (
                    <div className="text-center py-2">Đang tải...</div>
                  )}
                  {!hasMore && notifications.length > 0 && (
                    <div className="text-center py-2 text-gray-500">
                      Đã hết thông báo
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Avatar and Profile Dropdown */}
          <AvatarDropdownMenu />
        </div>
      </div>
    </div>
  );
}
