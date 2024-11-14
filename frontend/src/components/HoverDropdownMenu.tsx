import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "./ui/dropdown-menu"; // Adjust the import path as necessary
import { NavLink } from "react-router-dom";
import { MenuItem } from "./menuData"; // Ensure you're importing the correct MenuItem type

interface HoverDropdownMenuProps {
  link: MenuItem;
  dropdownItems: MenuItem[];
}

const HoverDropdownMenu: React.FC<HoverDropdownMenuProps> = ({ link, dropdownItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <DropdownMenuTrigger asChild>
          <NavLink
            to={link.href || "#"} // Ensure fallback for href
            className="text-black font-medium hover:text-green-500 px-2 py-3 rounded-md"
          >
            {link.label}
          </NavLink>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{link.label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => (window.location.href = item.href || "#")}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};

export default HoverDropdownMenu;
