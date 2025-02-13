import React, { useCallback, useMemo, useState } from "react";
import { IMenuItem } from "../interfaces/interfaces";
import CustomSelect from "./generic/CustomSelect/CustomSelect";
import { AvailableAlgorithms, AvailableMazes } from "../types/types";

interface INavProps {
  menuItems: IMenuItem[];
  isAlgoRunning?: boolean;
  onAlgorithmChange?: (value: AvailableAlgorithms) => void;
  onMazeChange?: (value: AvailableMazes) => void;
}

const Nav: React.FC<INavProps> = ({
  menuItems,
  isAlgoRunning,
  onAlgorithmChange,
}) => {
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

  const btnClasses = useMemo(() => {
    const scheme = colorSchemes[btnColorScheme];
    return `
      text-white
      bg-gradient-to-r
      ${scheme.gradient}
      hover:bg-gradient-to-br 
      focus:ring-4 
      focus:outline-none 
      ${scheme.focusRing}
      font-medium 
      rounded-lg 
      4k:rounded-3xl
      px-5
      4k:px-10
      py-2.5
      4k:py-5
      text-center
      4k:text-8xl
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
              onClick={() => item.onClick}
              className={btnClasses}
            >
              {item.name}
            </a>
          );
        case "button":
          return (
            <button
              key={item.name}
              onClick={
                // stupid type fix, TODO: figure out better way...
                item.onClick as unknown as
                  | React.MouseEventHandler<HTMLButtonElement>
                  | undefined
              }
              className={btnClasses}
              disabled={isAlgoRunning}
            >
              {item.name}
            </button>
          );
        case "dropdown":
          return (
            <CustomSelect
              key={item.name}
              options={item.children?.map((child) => ({
                name: child.name,
                value: child.value,
              }))}
              defaultValue={item.value}
              onChange={(value) => {
                if (item.name === "Mazes" && item.onClick) {
                  item.onClick(value);
                } else if (item.name === "Algorithm" && onAlgorithmChange) {
                  onAlgorithmChange(value as AvailableAlgorithms);
                }
              }}
              immediateAction={item.name === "Mazes"}
              isAlgoRunning={isAlgoRunning}
            />
          );
        default:
          return null;
      }
    },
    [btnClasses, isAlgoRunning, onAlgorithmChange]
  );

  return (
    <nav className="bg-gray-800 p-4 4k:p-12 4k:pl-56 relative">
      <div className="container mx-auto flex justify-between md:justify-start items-center gap-12 4k:gap-40">
        {/* Logo */}
        <div className="text-white text-lg 4k:text-6xl font-semibold">
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
        <div className="hidden md:flex space-x-4 gap-8 4k:gap-24">
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
