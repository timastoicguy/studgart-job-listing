import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setPage } from '../../store/navigationSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSpinner, FaGoogle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../lib/reducers/auth/Login'; // Import the login API function

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
  
    try {
      const data = await login(email, password); // Call the login function
  
      if (data.error) {
        toast.error(data.message || "Login failed. Please check your credentials.");
      } else {
        // Lưu accessToken và refreshToken vào local storage
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user_id', data.data.user._id);
        console.log("Login successful:", data.data);
        
        // Set default role to admin
        const userData = {
          name: data.data.user.username || "Default User", // or whatever name you receive
          role: data.data.user.role || "jobseeker" ,// Set the role as jobseeker
          id: data.data.user._id || "null" // Set the role as admin
        };
        localStorage.setItem('userData', JSON.stringify(userData)); // Save user data
  
        toast.success("Login successful!");
              // Delay navigation by 2 seconds
      setTimeout(() => {
        dispatch(setPage('about'));
        navigate('/about');
      }, 5000);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleGoogleLogin = () => {
    console.log("Google Login clicked");
    // Add Google OAuth logic here
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer newestOnTop />
      <div className="bg-white p-8 rounded-[24px] shadow-md w-full max-w-4xl flex">
        <div className="w-1/2 p-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-6">STUDGART</h2>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Username or primary email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaEnvelope className="ml-3 text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="Username or primary email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaLock className="ml-3 text-gray-400" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <button
            onClick={handleLogin}
            className={`bg-[#007acc] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? <FaSpinner className="mr-2 animate-spin" /> : "Log In"}
          </button>
          <button
            onClick={handleGoogleLogin}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center mt-4"
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </button>
          <div className="text-center mt-4">
            <Link to="/passwordreset" className="inline-block align-baseline font-bold text-sm text-[#007acc] hover:text-blue-800">
              Forgot password?
            </Link>
          </div>
          <div className="text-center mt-4">
            <Link to="/register" className="inline-block align-baseline font-bold text-sm text-[#007acc] hover:text-blue-800">
              Register now
            </Link>
          </div>
        </div>
        <div className="w-1/2 ml-4">
          <img src="/images/Right_Side_Image.webp" alt="Right Side Image" className="h-full w-full object-cover rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default Login;
