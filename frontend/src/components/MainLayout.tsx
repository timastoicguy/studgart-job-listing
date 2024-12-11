import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Fillter";
import { Suspense, useState, useEffect } from "react";
import clsx from "clsx";
import ChatBox from "./ChatBox"; // Import the ChatBox component
import { FaRegCommentDots, FaMinus } from "react-icons/fa"; // Import the minimize icon
import useAuthStore from "../store/auth/useAuthStore"; // Import Zustand store for auth

export default function MainLayout() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [chatVisible, setChatVisible] = useState<boolean>(false); // Initially set to false for hidden state
  const [isMinimized, setIsMinimized] = useState<boolean>(false); // State to manage minimize status
  
  // Get the userData from Zustand store
  //const {userData} = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  // Effect to redirect to login if user is not authenticated
  // useEffect(() => {
  //   console.log(userData);
  //   if (!userData) {
  //    // navigate("/login"); // Redirect to login if no user data is found in Zustand store
  //   }
  // }, [userData, navigate]);


  const { checkAuth1 ,userData} = useAuthStore();

  useEffect(() => {
    checkAuth1();
  }, [checkAuth1, navigate]);

  // Wait until userData is loaded to render the layout

  // Handle logout

  // Determine if sidebar should be shown based on the current route
  const shouldShowSidebar = location.pathname === "/about" || location.pathname.startsWith("/jobseeker/jobs");

  // Toggle chat visibility (show or hide)
  const toggleChat = () => {
    if (chatVisible) {
      setChatVisible(false); // Hide chat if it's visible
      setIsMinimized(false); // Reset minimize state when closing the chat
    } else {
      setChatVisible(true); // Show chat
      setIsMinimized(false); // Ensure chat is expanded when visible
    }
  };

  // Toggle chat minimize state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized); // Toggle minimize status
  };

  // Close the chat
  const closeChat = () => {
    setChatVisible(false); // Hide chat when close button is clicked
    setIsMinimized(false); // Reset minimize state when closing the chat
  };


  if (!userData) {
    return null; // or a loading spinner, depending on your preference
  }


  return (
    <div className="w-full min-h-screen bg-custom">
      <Header
        showSideBar={showSidebar}
        setShowSideBar={setShowSidebar}
      />

      {/* Only render Sidebar when on specified pages like About or Jobs */}
      {shouldShowSidebar && <Sidebar showSidebar={showSidebar} />}

      {/* Dims background when SideBar is active */}
      <div
        onClick={() => setShowSidebar(false)} // Close sidebar on background click
        className={clsx(
          "fixed lg:hidden w-screen h-screen top-[6] left-0 z-30 duration-200 bg-gray-500/80",
          {
            invisible: !showSidebar,
            visible: showSidebar,
          }
        )}
      />

      {/* Displays other views, adjusts layout based on sidebar visibility */}
      <div className={clsx("transition-all", { "ml-0": !shouldShowSidebar, "ml-[270px]": showSidebar })}>
        <Suspense>
          <Outlet />
        </Suspense>
      </div>

      {/* ChatBox Component */}
      {chatVisible && !isMinimized && (
        <div className="fixed bottom-20 right-4 z-50">
          <ChatBox onClose={closeChat} /> {/* Pass the closeChat function */}
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 p-3 bg-green-500 text-white rounded-full shadow-lg z-40"
      >
        <FaRegCommentDots size={20} />
      </button>

      {/* Minimize Button */}
      {chatVisible && !isMinimized && (
        <button
          onClick={toggleMinimize}
          className="absolute top-2 right-2 text-xl text-gray-500 z-50"
        >
          <FaMinus />
        </button>
      )}
    </div>
  );
}
