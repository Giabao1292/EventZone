"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CollapsibleContext = createContext();

const Collapsible = ({ children, open, onOpenChange }) => {
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
    <CollapsibleContext.Provider
      value={{ isOpen, setIsOpen: handleOpenChange }}
    >
      <div>{children}</div>
    </CollapsibleContext.Provider>
  );
};

const CollapsibleTrigger = ({ children, asChild, ...props }) => {
  const { isOpen, setIsOpen } = useContext(CollapsibleContext);

  const handleClick = () => {
    setIsOpen(!isOpen);
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

const CollapsibleContent = ({ children, className = "", ...props }) => {
  const { isOpen } = useContext(CollapsibleContext);

  return (
    <div
      className={`overflow-hidden transition-all duration-200 ${
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
