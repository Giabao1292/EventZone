"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

const SelectContext = createContext();

const Select = ({ children, value, onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    value || defaultValue || ""
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    setIsOpen(false);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <SelectContext.Provider
      value={{
        isOpen,
        setIsOpen,
        selectedValue,
        handleValueChange,
      }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = ({ children, className = "", ...props }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

const SelectValue = ({ placeholder = "Select..." }) => {
  const { selectedValue } = useContext(SelectContext);

  const getDisplayText = (value) => {
    switch (value) {
      case "1":
        return "Hoạt động";
      case "0":
        return "Không hoạt động";
      case ":":
        return "=";
      case "<":
        return "<";
      case ">":
        return ">";
      case "5":
      case "10":
      case "20":
      case "50":
        return value;
      default:
        return value || placeholder;
    }
  };

  return <span className="truncate">{getDisplayText(selectedValue)}</span>;
};

const SelectContent = ({ children, className = "" }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg ${className}`}
    >
      <div className="max-h-60 overflow-auto p-1">{children}</div>
    </div>
  );
};

const SelectItem = ({ children, value, className = "" }) => {
  const { handleValueChange } = useContext(SelectContext);

  return (
    <div
      className={`flex w-full cursor-pointer select-none items-center justify-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 ${className}`}
      onMouseDown={(e) => {
        e.preventDefault();
        handleValueChange(value);
      }}
    >
      {children}
    </div>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
