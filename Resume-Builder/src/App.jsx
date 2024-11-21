import './App.css';
import { Navigate, Outlet } from 'react-router-dom';
import Header from './components/custom/Header';
import { Toaster } from './components/ui/sonner';
import useAuthStore from './stores/authStore';


function App() {
  const { isAuthenticated } = useAuthStore();


  if (!isAuthenticated) {
    return <Navigate to={'/auth/sign-in'} />;
  }

  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
