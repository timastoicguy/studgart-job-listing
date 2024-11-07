import { NavLink } from "react-router-dom";

export default function NavLinks() {
  return (
    <nav>
      <ul className="flex flex-col space-y-4">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-bold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-bold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-bold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Settings
          </NavLink>
        </li>
        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
}
