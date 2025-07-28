"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { X } from "lucide-react";

const DialogContext = createContext();

const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, asChild, ...props }) => {
  const { setIsOpen } = useContext(DialogContext);

  const handleClick = () => {
    setIsOpen(true);
  };

  if (asChild) {
    return (
      <div onClick={handleClick} {...props}>
        {children}
      </div>
    );
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

const DialogContent = ({ children, className = "", ...props }) => {
  const { isOpen, setIsOpen } = useContext(DialogContext);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog Content */}
      <div
        className={`
          relative p-8 bg-white rounded-xl shadow-2xl border border-gray-200
          max-w-4xl w-full max-h-[90vh] overflow-y-auto
          transform transition-all duration-300 scale-100
          ${className}
        `}
        {...props}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="
            absolute right-4 top-4 z-10 rounded-full p-2
            bg-gray-100 hover:bg-gray-200 
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          "
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children, className = "", ...props }) => (
  <div
    className={`flex flex-col space-y-2 text-center sm:text-left p-6 pb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const DialogTitle = ({ children, className = "", ...props }) => (
  <h2
    className={`text-xl font-semibold leading-tight tracking-tight text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </h2>
);

const DialogDescription = ({ children, className = "", ...props }) => (
  <p
    className={`text-sm text-gray-600 leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </p>
);

const DialogFooter = ({ children, className = "", ...props }) => (
  <div
    className={`
      flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 
      p-6 pt-4 border-t border-gray-100 bg-gray-50/50
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
