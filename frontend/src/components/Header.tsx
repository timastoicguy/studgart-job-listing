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
import { roleOptions, MenuItem as RoleMenuItem } from "./menuData"; // Import menu data and alias MenuItem for clarity
import { NavLink } from "react-router-dom";
import socket from "@/store/socket"; // Ensure socket is configured correctly
import axios from "axios";
import AvatarDropdownMenu from "./AvatarDropdownMenu"; // Import AvatarDropdownMenu component
import HoverDropdownMenu from "./HoverDropdownMenu"; // Import HoverDropdownMenu component

interface HeaderProps {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
  userData: { name: string; role: string; id?: string } | null; // Added 'id' as optional
  onLogout: () => void;
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

export default function Header({ showSideBar, setShowSideBar, userData, onLogout }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [badgeCount, setBadgeCount] = useState<number>(0);

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      fetchNotifications(parsedData.id); // Fetch notifications for the user
    }

    // Set up socket connection
    socket.connect();
    socket.on("joinNotification", (data) => {
      setBadgeCount((prev) => prev + 1); // Increment badge count for new notifications
    });

    return () => {
      socket.off("joinNotification");
      socket.disconnect();
    };
  }, []);

  const fetchNotifications = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/notifications/${userId}?page=1&limit=10`);
      if (response.data.success) {
        setNotifications(response.data.notifications.docs);
        setBadgeCount(response.data.notifications.docs.filter((n: any) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`/api/notifications/markAsRead`, { userId: userData?.id });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, isRead: true }))
      );
      setBadgeCount(0); // Reset the badge count after marking all as read
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await axios.patch(`http://localhost:3000/api/notification/${notificationId}`, {
        isRead: true
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
      setBadgeCount((prev) => prev - 1); // Decrease badge count when a notification is marked as read
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (!userData) {
    return null; // Return null if no user data is found
  }

  return (
    <div className="sticky w-full left-0 top-0 z-50">
      <div className="flex flex-row px-2 py-2.5 ml-0 bg-header justify-between items-center shadow-md">
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
            <img src="..\public\images\logo.png" alt="Logo" className="h-8" />
            <span className="ml-2 text-lg font-semibold text-green-500">STUDGART</span>
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
                <div className=" max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 ${notification.isRead ? "bg-white text-black" : "bg-gray-100 text-black"} border-b border-gray-200 text-sm`}
                        onClick={() => !notification.isRead && markNotificationAsRead(notification._id)}
                      >
                        {notification.content}
                      </div>
                    ))
                  ) : (
                    <div>Không có thông báo nào</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Avatar and Profile Dropdown */}
          <AvatarDropdownMenu userData={userData} onLogout={onLogout} />
        </div>
      </div>
    </div>
  );
}
