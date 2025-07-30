"use client";

import * as React from "react";

// Simple className utility function
const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const InputOTP = React.forwardRef(
  (
    {
      className,
      maxLength,
      value,
      onChange,
      disabled = false,
      autoFocus = false,
      allowLetters = true,
      ...props
    },
    ref
  ) => {
    const inputRefs = React.useRef([]);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    // Initialize refs array
    React.useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, maxLength);
    }, [maxLength]);

    // Auto focus first input
    React.useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus();
        setActiveIndex(0);
      }
    }, [autoFocus]);

    const handleInputChange = (index, inputValue) => {
      if (disabled) return;

      // Allow letters and numbers, or only numbers based on allowLetters prop
      let character;
      if (allowLetters) {
        // Allow alphanumeric characters (letters and numbers) - keep original case
        character = inputValue.replace(/[^a-zA-Z0-9]/g, "").slice(-1);
      } else {
        // Only allow digits
        character = inputValue.replace(/\D/g, "").slice(-1);
      }

      const newValue = value.split("");
      newValue[index] = character;

      // Pad with empty strings if needed
      while (newValue.length < maxLength) {
        newValue.push("");
      }

      const updatedValue = newValue.join("").slice(0, maxLength);
      onChange(updatedValue);

      // Move to next input if character was entered
      if (character && index < maxLength - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
          setActiveIndex(index + 1);
        }
      }
    };

    const handleKeyDown = (index, e) => {
      if (disabled) return;

      if (e.key === "Backspace") {
        e.preventDefault();

        const newValue = value.split("");

        if (newValue[index]) {
          // Clear current input
          newValue[index] = "";
        } else if (index > 0) {
          // Move to previous input and clear it
          newValue[index - 1] = "";
          const prevInput = inputRefs.current[index - 1];
          if (prevInput) {
            prevInput.focus();
            setActiveIndex(index - 1);
          }
        }

        const updatedValue = newValue.join("");
        onChange(updatedValue);
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          setActiveIndex(index - 1);
        }
      } else if (e.key === "ArrowRight" && index < maxLength - 1) {
        e.preventDefault();
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
          setActiveIndex(index + 1);
        }
      }
    };

    const handleFocus = (index) => {
      setActiveIndex(index);
    };

    const handleBlur = () => {
      setActiveIndex(-1);
    };

    const handlePaste = (e) => {
      e.preventDefault();
      if (disabled) return;

      let pastedData;
      if (allowLetters) {
        // Allow alphanumeric characters - keep original case
        pastedData = e.clipboardData
          .getData("text")
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(0, maxLength);
      } else {
        // Only allow digits
        pastedData = e.clipboardData
          .getData("text")
          .replace(/\D/g, "")
          .slice(0, maxLength);
      }

      onChange(pastedData);

      // Focus the next empty input or the last input
      const nextEmptyIndex = Math.min(pastedData.length, maxLength - 1);
      const targetInput = inputRefs.current[nextEmptyIndex];
      if (targetInput) {
        targetInput.focus();
        setActiveIndex(nextEmptyIndex);
      }
    };

    return (
      <div
        ref={ref}
        className={classNames("flex items-center gap-2", className)}
        {...props}
      >
        {Array.from({ length: maxLength }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode={allowLetters ? "text" : "numeric"}
            pattern={allowLetters ? "[a-zA-Z0-9]*" : "\\d*"}
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            onPaste={handlePaste}
            disabled={disabled}
            className={classNames(
              "flex h-12 w-12 items-center justify-center rounded-md border border-gray-300 bg-white text-center text-lg font-medium text-gray-900 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              activeIndex === index && "ring-2 ring-blue-500 border-blue-500",
              value[index] && "border-blue-500"
            )}
            aria-label={`Character ${index + 1} of ${maxLength}`}
          />
        ))}
      </div>
    );
  }
);

InputOTP.displayName = "InputOTP";

// Group component for better organization
const InputOTPGroup = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames("flex items-center gap-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

InputOTPGroup.displayName = "InputOTPGroup";

// Individual slot component (for more granular control if needed)
const InputOTPSlot = React.forwardRef(
  (
    {
      className,
      index,
      isActive = false,
      hasValue = false,
      allowLetters = true,
      ...props
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type="text"
        inputMode={allowLetters ? "text" : "numeric"}
        pattern={allowLetters ? "[a-zA-Z0-9]*" : "\\d*"}
        maxLength={1}
        className={classNames(
          "flex h-12 w-12 items-center justify-center rounded-md border border-gray-300 bg-white text-center text-lg font-medium text-gray-900 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isActive && "ring-2 ring-blue-500 border-blue-500",
          hasValue && "border-blue-500",
          className
        )}
        aria-label={`Character ${index + 1}`}
        {...props}
      />
    );
  }
);

InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot };
