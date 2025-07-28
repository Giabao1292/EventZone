import { useState } from "react";
import PropTypes from "prop-types";

const OrganizerCard = ({
  title,
  subtitle,
  icon,
  value,
  change,
  changeType = "positive",
  onClick,
  className = "",
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getChangeColor = () => {
    if (changeType === "positive") return "text-green-600";
    if (changeType === "negative") return "text-red-600";
    return "text-blue-600";
  };

  const getChangeIcon = () => {
    if (changeType === "positive") return "↗";
    if (changeType === "negative") return "↘";
    return "→";
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-500 ease-out ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background with glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-orange-50/80 to-blue-50/80 rounded-2xl border border-blue-200/50 backdrop-blur-xl shadow-lg"></div>

      {/* Animated border */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-200/30 via-orange-200/30 to-blue-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}
      ></div>

      {/* Content */}
      <div className="relative p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Change indicator */}
          {change && (
            <div
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-100/50 to-orange-100/50 border border-blue-200/30 ${getChangeColor()}`}
            >
              <span className="text-sm font-medium">{getChangeIcon()}</span>
              <span className="text-xs font-medium">{change}</span>
            </div>
          )}
        </div>

        {/* Value */}
        {value && (
          <div className="mb-4">
            <div className="text-3xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
              {value}
            </div>
          </div>
        )}

        {/* Children content */}
        {children && <div className="mt-4">{children}</div>}

        {/* Hover effect overlay */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-100/20 to-orange-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300 transition-opacity duration-300"></div>
    </div>
  );
};

OrganizerCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  change: PropTypes.string,
  changeType: PropTypes.oneOf(["positive", "negative", "neutral"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default OrganizerCard;
