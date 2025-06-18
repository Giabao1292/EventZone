import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const CategoryNav = ({ onSelectCategory, selectedCategoryId }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories"
        );
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error("Dữ liệu không phải là mảng:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="relative z-20 w-full bg-[#1E2029] shadow-md">
      {/* Background glow center */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[400px] h-[400px] bg-[#FF1B00] opacity-[0.07] blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-4 flex justify-center gap-3 sm:gap-6 flex-wrap">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.categoryId;

          return (
            <button
              key={cat.categoryId}
              onClick={() => onSelectCategory?.(cat.categoryId)}
              className={`relative px-5 py-2 sm:py-2.5 rounded-md font-semibold text-sm sm:text-base
                transition-all duration-200 backdrop-blur
                ${
                  isSelected
                    ? "text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
            >
              {cat.categoryName}

              {/* Gạch dưới full width */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 bottom-0 h-[2px] w-full bg-emerald-400 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
