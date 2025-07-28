import { useState } from "react";
import PropTypes from "prop-types";

const OrganizerButton = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  onClick,
  className = "",
  fullWidth = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getVariantClasses = () => {
    const baseClasses =
      "relative overflow-hidden transition-all duration-300 ease-out font-medium rounded-xl border backdrop-blur-sm";

    const variants = {
      primary:
        "bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white border-blue-400/30 hover:border-blue-500/50 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
      secondary:
        "bg-gradient-to-r from-blue-100/50 to-orange-100/50 hover:from-blue-200/50 hover:to-orange-200/50 text-slate-700 hover:text-slate-800 border-blue-200/30 hover:border-blue-300/50",
      outline:
        "bg-transparent hover:bg-blue-50 text-slate-600 hover:text-slate-700 border-blue-300/50 hover:border-blue-400/70",
      ghost:
        "bg-transparent hover:bg-blue-50 text-slate-600 hover:text-slate-700 border-transparent",
      danger:
        "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-red-400/30 hover:border-red-500/50 shadow-lg shadow-red-500/25 hover:shadow-red-500/40",
      success:
        "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-green-400/30 hover:border-green-500/50 shadow-lg shadow-green-500/25 hover:shadow-green-500/40",
    };

    return `${baseClasses} ${variants[variant]}`;
  };

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

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${loading ? "cursor-wait" : ""}
        ${isPressed ? "scale-95" : "hover:scale-105"}
        ${className}
      `}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      {...props}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative flex items-center justify-center space-x-2">
        {loading ? (
          <>
            <div className={`${getIconSize()} animate-spin`}>
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span
                className={`${getIconSize()} flex items-center justify-center`}
              >
                {icon}
              </span>
            )}
            <span>{children}</span>
            {icon && iconPosition === "right" && (
              <span
                className={`${getIconSize()} flex items-center justify-center`}
              >
                {icon}
              </span>
            )}
          </>
        )}
      </div>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </button>
  );
};

OrganizerButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "ghost",
    "danger",
    "success",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default OrganizerButton;
