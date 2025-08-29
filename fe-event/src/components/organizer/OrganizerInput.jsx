import { useState, forwardRef } from "react";
import PropTypes from "prop-types";

const OrganizerInput = forwardRef(
  (
    {
      type = "text",
      as,
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      error,
      required = false,
      disabled = false,
      readOnly = false,
      className = "",
      icon,
      iconPosition = "left",
      size = "md",
      fullWidth = false,
      rows = 3,
      children,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Use 'as' prop if provided, otherwise use 'type'
    const inputType = as || type;

    const getSizeClasses = () => {
      const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-6 py-4 text-lg",
        xl: "px-8 py-5 text-xl",
      };
      return sizes[size];
    };

    const getIconSize = () => {
      const sizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-7 h-7",
      };
      return sizes[size];
    };

    const handleFocus = (e) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const baseClasses = `
      relative w-full transition-all duration-300 ease-out font-medium rounded-xl border backdrop-blur-sm
      bg-white/80 hover:bg-white/90 focus:bg-white
      border-slate-200/50 hover:border-blue-400/70 focus:border-blue-500/80
      text-slate-700 placeholder-slate-400
      focus:outline-none focus:ring-2 focus:ring-blue-500/20
      ${getSizeClasses()}
      ${fullWidth ? "w-full" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed bg-slate-100" : "cursor-text"}
      ${readOnly ? "bg-slate-100 cursor-default" : ""}
      ${
        error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""
      }
      ${isFocused ? "shadow-lg shadow-blue-500/10" : ""}
      ${isHovered ? "shadow-md shadow-blue-500/5" : ""}
    `;

    const iconClasses = `
      absolute top-1/2 transform -translate-y-1/2 text-slate-400
      ${iconPosition === "left" ? "left-4" : "right-4"}
      ${getIconSize()}
      transition-colors duration-300
      ${isFocused ? "text-blue-500" : ""}
      ${isHovered ? "text-blue-400" : ""}
    `;

    const renderInput = () => {
      switch (inputType) {
        case "textarea":
          return (
            <div className="relative group">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-orange-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

              {/* Floating particles */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-200 transition-opacity duration-300"></div>

              {icon && <div className={iconClasses}>{icon}</div>}
              <textarea
                ref={ref}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                rows={rows}
                className={`${baseClasses} resize-none relative z-10 ${
                  icon ? (iconPosition === "left" ? "pl-12" : "pr-12") : ""
                }`}
                {...props}
              />
            </div>
          );

        case "select":
          return (
            <div className="relative group">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-orange-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

              {/* Floating particles */}
              <div className="absolute top-2 right-8 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-200 transition-opacity duration-300"></div>

              {icon && <div className={iconClasses}>{icon}</div>}
              <select
                ref={ref}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={disabled}
                className={`${baseClasses} appearance-none relative z-10 ${
                  icon ? (iconPosition === "left" ? "pl-12" : "pr-12") : ""
                }`}
                {...props}
              >
                {children}
              </select>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none z-20">
                <svg
                  className="w-4 h-4 text-slate-400 transition-colors duration-300 group-hover:text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          );

        case "file":
          return (
            <div className="relative group">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-orange-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

              {/* Floating particles */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-200 transition-opacity duration-300"></div>

              <input
                ref={ref}
                type="file"
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={disabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                {...props}
              />
              <div
                className={`
                  ${baseClasses} cursor-pointer flex items-center justify-center relative z-10
                  ${icon ? (iconPosition === "left" ? "pl-12" : "pr-12") : ""}
                `}
              >
                {icon && <div className={iconClasses}>{icon}</div>}
                <span className="text-center">
                  {value
                    ? value.name || "File đã chọn"
                    : placeholder || "Chọn file"}
                </span>
              </div>
            </div>
          );

        default:
          return (
            <div className="relative group">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-orange-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

              {/* Floating particles */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-200 transition-opacity duration-300"></div>

              {icon && <div className={iconClasses}>{icon}</div>}
              <input
                ref={ref}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                className={`${baseClasses} relative z-10 ${
                  icon ? (iconPosition === "left" ? "pl-12" : "pr-12") : ""
                }`}
                {...props}
              />
            </div>
          );
      }
    };

    return (
      <div className={`space-y-3 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-slate-600 group-hover:text-blue-500 transition-colors duration-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {renderInput()}

        {error && (
          <div className="flex items-center space-x-2 text-red-500 text-sm animate-pulse">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
      </div>
    );
  }
);

OrganizerInput.displayName = "OrganizerInput";

OrganizerInput.propTypes = {
  type: PropTypes.oneOf([
    "text",
    "email",
    "password",
    "number",
    "tel",
    "url",
    "date",
    "time",
    "datetime-local",
    "textarea",
    "select",
    "file",
  ]),
  as: PropTypes.oneOf(["textarea", "select"]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  fullWidth: PropTypes.bool,
  rows: PropTypes.number,
  children: PropTypes.node,
};

export default OrganizerInput;
