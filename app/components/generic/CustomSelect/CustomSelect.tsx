import React, { useState, useRef, useEffect } from "react";

interface DropdownOption {
  name: string;
  value: string | undefined;
}

interface CustomSelectProps {
  options: DropdownOption[] | undefined;
  defaultValue?: string;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  defaultValue,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange(value);
    setIsOpen(false);
  };

  const selectedOption =
    options && options.find((option) => option.value === selectedValue);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`
          bg-gray-800
          rounded-lg
          focus:ring-2
          focus:ring-teal-500
          focus:outline-none
          block
          w-full
          p-2.5
          text-left
          cursor-pointer
          hover:bg-teal-600
          transition-colors
          duration-200
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.name : "Select an option"}
        <svg
          className="w-4 h-4 ml-1 inline-block"
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
            w-full
            bg-gray-800
            rounded-lg
            shadow-lg
            overflow-hidden
            transition-all
            duration-200
          `}
        >
          {options?.map((option) => (
            <div
              key={option.value}
              className={`
                p-2.5
                cursor-pointer
                hover:bg-teal-700
                transition-colors
                duration-200
                ${selectedValue === option.value ? "bg-teal-700" : ""}
              `}
              onClick={() => handleSelect(option.value || "")}
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
