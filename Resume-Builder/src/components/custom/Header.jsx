import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import useAuthStore from '@/stores/authStore'; // Import the auth store

import UserButton from './UserButton';
function Header() {
    const { user, isAuthenticated } = useAuthStore();

    return (
        <div className='p-3 px-5 flex justify-between shadow-md'>
            <Link to={'/dashboard'}>
                <span className="text-3xl font-bold text-primary">STUDGART</span>
            </Link>
            {isAuthenticated ? (
                <div className='flex gap-2 items-center'>
                    <Link to={'/dashboard'}>
                        <Button variant="outline">Dashboard</Button>
                    </Link>
                    <UserButton user={user} /> {/* Pass user object to UserButton */}
                </div>
            ) : (
                <Link to={'/auth/sign-in'}>
                    <Button>Get Started</Button>
                </Link>
            )}
        </div>
    );
}

export default Header;
