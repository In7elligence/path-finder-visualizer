import { IMenuItem } from "@/app/interfaces/interfaces";
import React, { useEffect, useMemo, useState } from "react";
import SimpleButton from "../generic/SimpleButton/SimpleButton";
import CustomSelect from "../generic/CustomSelect/CustomSelect";

interface INavProps {
  menuItems: IMenuItem[];
  isAlgoRunning?: boolean;
}

const Nav: React.FC<INavProps> = ({ menuItems, isAlgoRunning }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
      mt-4
      slt:mt-auto
      rounded-lg 
      4k:rounded-2xl
      px-5
      4k:px-6
      py-2.5
      4k:py-4
      text-center
      4k:text-3xl
    `;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnColorScheme]);

  const renderMenuItem = (item: IMenuItem) => {
    switch (item.type) {
      case "simpleButton":
        return (
          <SimpleButton
            key={item.name}
            text={item.name}
            isDisabled={item.isDisabled}
            onClick={item.onClick}
            isAlgoRunning={isAlgoRunning}
          />
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
          <CustomSelect
            key={item.name}
            options={item.children?.map((child) => ({
              name: child.name,
              value: child.value,
            })) || []}
            value={item.value}
            placeholder={item.name}
            onChange={item.onChange}
            disabled={isAlgoRunning}
            formatDisplayText={item.formatDisplayText}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isAlgoRunning) setIsMenuOpen(false);
  }, [isAlgoRunning])

  return (
    <nav className="bg-gray-800 p-4 4k:p-12 4k:pl-56 relative slt:text-sm">
      <div className="container mx-auto flex justify-between slt:justify-start items-center gap-12 4k:gap-40">
        {/* Logo */}
        <div className="text-white text-lg 4k:text-4xl font-semibold">
          Pathfinding Visualizer
        </div>

        {/* Mobile Menu Button */}
        <div className="slt:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden slt:flex space-x-4 gap-8 4k:gap-24">
          {menuItems.map(renderMenuItem)}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`slt:hidden ${
          isMenuOpen ? "block" : "hidden"
        } bg-gray-800 absolute left-0 w-full z-10`}
      >
        <div className="flex flex-col-reverse space-y-2 p-4">
          {menuItems.map(renderMenuItem)}
        </div>
      </div>
    </nav>
  );
};

export default Nav;