import React from "react";

const StarRating = ({ value, onChange, readOnly = false }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`cursor-pointer text-xl ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
                    onClick={() => !readOnly && onChange(star)}
                >
          ★
        </span>
            ))}
        </div>
    );
};

export default StarRating;
