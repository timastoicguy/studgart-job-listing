/* eslint-disable react/prop-types */
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { Link } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';

function UserButton({ user }) {
    const { logout } = useAuthStore();

    if (!user) return null;

    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-gray-100 transition focus:outline-none">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="text-gray-800">{user.email}</span>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="mt-2 w-48 bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
                    <DropdownMenuItem>
                        <Link to={`/profile/${user._id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            View Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default UserButton;
