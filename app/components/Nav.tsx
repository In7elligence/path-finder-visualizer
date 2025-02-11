import React, { useCallback, useMemo, useState } from "react";
import { IMenuItem } from "../interfaces/interfaces";

interface INavProps {
  menuItems: IMenuItem[];
  isAlgoRunning?: boolean;
}

const Nav: React.FC<INavProps> = ({ menuItems, isAlgoRunning }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const btnColorScheme = useMemo(
    () => (isAlgoRunning ? "red" : "teal"),
    [isAlgoRunning]
  );

  const colorSchemes = {
    teal: {
      gradient: "from-teal-400 via-teal-500 to-teal-600",
      focusRing: "focus:ring-teal-300 dark:focus:ring-teal-800",
    },
    red: {
      gradient: "from-red-400 via-red-500 to-red-600",
      focusRing: "focus:ring-red-300 dark:focus:ring-red-800",
    },
  };

  // Get the classes for the current color scheme
  const btnClasses = useMemo(() => {
    const scheme = colorSchemes[btnColorScheme];
    return `
      text-white bg-gradient-to-r
      ${scheme.gradient}
      hover:bg-gradient-to-br 
      focus:ring-4 
      focus:outline-none 
      ${scheme.focusRing}
      font-medium 
      rounded-lg 
      text-sm 
      px-5
      py-2.5 
      text-center
    `;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnColorScheme]);

  const renderMenuItem = useCallback(
    (item: IMenuItem) => {
      switch (item.type) {
        case "anchor":
          return (
            <a
              key={item.name}
              href={item.href || "#"}
              onClick={item.onClick}
              className={btnClasses}
            >
              {item.name}
            </a>
          );
        case "button":
          return (
            <button
              key={item.name}
              onClick={item.onClick}
              className={btnClasses}
              disabled={isAlgoRunning}
            >
              {item.name}
            </button>
          );
        case "dropdown":
          return (
            <select
              key={item.name}
              defaultValue={item.value}
              onChange={() => {
                if (item.onClick) item.onClick();
              }}
              className={`
                bg-gray-800
                rounded-lg
                focus:ring-teal-500
                focus:border-teal-500
                block
                w-full
                p-2.5
                cursor-pointer
                hover:text-teal-400`}
            >
              {item.children?.map((child) => (
                <option
                  key={child.name}
                  value={child.value}
                  className="bg-gray-800"
                >
                  {child.name}
                </option>
              ))}
            </select>
          );
        default:
          return null;
      }
    },
    [btnClasses, isAlgoRunning]
  );

  return (
    <nav className="bg-gray-800 p-4 relative">
      <div className="container mx-auto flex justify-between md:justify-start items-center gap-12">
        {/* Logo */}
        <div className="text-white text-lg font-semibold">
          Path Finder Visualizer
        </div>

        {/* Burger Menu Button (Visible on Mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Menu (Hidden on Mobile, Visible on Desktop) */}
        <div className="hidden md:flex space-x-4 gap-8">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </div>

      {/* Mobile Menu (Hidden by Default) */}
      <div
        className={`md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } bg-gray-800 absolute left-0`}
        style={{ width: "100vw", zIndex: "1" }}
      >
        <div className="flex flex-col space-y-2 p-4">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
