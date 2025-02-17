import React, { useState, useRef, useEffect, useMemo } from "react";

interface DropdownOption {
  name: string;
  value: string;
}

interface CustomSelectProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  formatDisplayText?: (selectedOption: DropdownOption | undefined) => string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  disabled = false,
  formatDisplayText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const colorSchemes = {
    normal: {
      focusRing: "focus:ring-teal-500",
      hover: "hover:bg-teal-600",
      cursor: "cursor-pointer",
    },
    disabled: {
      focusRing: "focus:ring-red-500",
      hover: "hover:bg-red-600",
      cursor: "cursor-default",
    },
  };

  const btnColorScheme = useMemo(
    () => (disabled ? "disabled" : "normal"),
    [disabled]
  );

  const btnClasses = useMemo(() => {
    const scheme = colorSchemes[btnColorScheme];
    return `
      bg-gray-800
      rounded-lg
      focus:ring-2
      ${scheme.focusRing}
      focus:outline-none
      block
      w-full
      p-2.5
      text-center
      md:text-left
      ${scheme.cursor}
      ${scheme.hover}
      transition-colors
      duration-200
    `;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnColorScheme, disabled]);

  const handleSelect = (selectedValue: string) => {
    if (disabled) return;
    if (onChange) onChange(selectedValue);

    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative 4k:text-3xl 4k:flex" ref={dropdownRef}>
      <button
        type="button"
        className={btnClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {formatDisplayText
          ? formatDisplayText(selectedOption)
          : selectedOption
          ? selectedOption.name
          : placeholder}
        <svg
          className="w-4 h-4 ml-1 4k:w-12 4k:h-12 inline-block"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`
            absolute
            z-10
            mt-2
            4k:mt-36
            w-full
            md:min-w-[300px]
            4k:w-[620px]
            bg-gray-800
            rounded-lg
            4k:rounded-3xl
            shadow-lg
            4k:shadow-2xl
            overflow-hidden
            transition-all
            duration-200
          `}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`
                p-2.5
                cursor-pointer
                hover:bg-teal-700
                transition-colors
                duration-200
                ${value === option.value ? "bg-teal-700" : ""}
              `}
              onClick={() => !disabled && handleSelect(option.value)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
