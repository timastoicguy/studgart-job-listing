/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSpinner, FaGoogle } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useLoginStore from '../../lib/reducers/auth/loginStore';
import { useNavigate } from 'react-router-dom';
import { setPage } from '../../store/navigationSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    email, password, loading, setEmail, setPassword, handleLogin
  } = useLoginStore();

  const handleGoogleLogin = () => {
    console.log("Google Login clicked");
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
            onClick={() => handleLogin(navigate, setPage)}
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
