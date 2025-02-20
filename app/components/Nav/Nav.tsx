import { IMenuItem } from "@/app/interfaces/interfaces";
import React, { useEffect, useMemo, useState } from "react";
import SimpleButton from "../generic/SimpleButton/SimpleButton";
import CustomSelect from "../generic/CustomSelect/CustomSelect";
import HelpButton from "../generic/HelpButton/HelpButton";
import { regularBtnColorScheme } from "@/app/theme/colorSchemes";
import GitHubButton from "../generic/GitHubButton/GitHubButton";

interface INavProps {
  menuItems: IMenuItem[];
  isAlgoRunning?: boolean;
}

const Nav: React.FC<INavProps> = ({ menuItems, isAlgoRunning }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const btnColorScheme = useMemo(
    () => (isAlgoRunning ? "disabled" : "normal"),
    [isAlgoRunning]
  );

  const regularBtnClasses = useMemo(() => {
    const scheme = regularBtnColorScheme[btnColorScheme];
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
            className={item.extraClassName}
          />
        );

      case "button":
        return (
          <button
            key={item.name}
            onClick={item.onClick}
            className={`${regularBtnClasses} ${item.extraClassName}`}
            disabled={isAlgoRunning}
          >
            {item.name}
          </button>
        );
      case "helpButton":
        return (
          <HelpButton
            key={item.name}
            text={item.name}
            onClick={item.onClick}
            isAlgoRunning={isAlgoRunning}
            className={item.extraClassName}
          />
        );
      case "dropdown":
        return (
          <CustomSelect
            key={item.name}
            className={item.extraClassName}
            options={
              item.children?.map((child) => ({
                name: child.name,
                value: child.value,
              })) || []
            }
            value={item.value}
            placeholder={item.name}
            onChange={item.onChange}
            disabled={isAlgoRunning}
            formatDisplayText={item.formatDisplayText}
          />
        );
      case "githubButton":
        return (
          <GitHubButton
            key={item.name}
            className={item.extraClassName}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isAlgoRunning) setIsMenuOpen(false);
  }, [isAlgoRunning]);

  return (
    <nav className="bg-gray-800 p-4 4k:p-12 4k:pl-56 relative slt:text-sm">
      <div className="container mx-auto flex justify-between slt:justify-center llt:justify-start items-center gap-12 slt:gap-5 llt:gap-12 4k:gap-40">
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
        <div className="hidden slt:flex slt:items-center slt:justify-center space-x-4 sm:gap-0 llt:gap-4 4k:gap-24 text-xs llt:text-base">
          {menuItems.map(renderMenuItem)}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`slt:hidden ${
          isMenuOpen ? "block" : "hidden"
        } bg-gray-800 absolute left-0 w-full z-10`}
      >
        <div className="flex flex-col-reverse p-4">
          {menuItems.map(renderMenuItem)}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
