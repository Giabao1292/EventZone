// src/components/dashboard/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react"; // Icons

const ProductCard = ({ imageSrc, title, price, oldPrice, rating }) => {
  // Helper function to render stars
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(
          <li key={i}>
            <Star
              fill="#FACC15"
              strokeWidth={0}
              className="text-yellow-500 text-sm"
            />
          </li>
        );
      } else {
        stars.push(
          <li key={i}>
            <Star className="text-yellow-500 text-sm" />
          </li>
        );
      }
    }
    return stars;
  };

  return (
    <div className="card overflow-hidden">
      <div className="relative">
        <Link to="#">
          <img src={imageSrc} alt={title} className="w-full" />
        </Link>
        <Link
          to="#"
          className="bg-blue-600 w-8 h-8 flex justify-center items-center text-white rounded-full absolute bottom-0 right-0 mr-4 -mb-3"
        >
          <ShoppingCart className="text-base" />
        </Link>
      </div>
      <div className="card-body">
        <h6 className="text-base font-semibold text-gray-500 mb-1">{title}</h6>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <h6 className="text-gray-500 font-semibold text-base">{price}</h6>
            <span className="text-gray-400 font-medium text-sm opacity-80">
              <del>{oldPrice}</del>
            </span>
          </div>
          <ul className="list-none flex gap-1">{renderStars()}</ul>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
