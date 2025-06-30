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

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    selected: { scale: 1.08 },
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-[#1E2029]/80 to-[#1E2029] shadow-lg backdrop-blur-sm overflow-hidden">
      {/* Background glow center */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
        <div className="w-[300px] h-[300px] bg-yellow-500/10 opacity-40 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 flex justify-center gap-3 sm:gap-4 flex-wrap">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.categoryId;

          return (
            <motion.button
              key={cat.categoryId}
              onClick={() => onSelectCategory?.(cat.categoryId)}
              className={`relative px-4 py-2 rounded-md font-medium text-sm sm:text-base transition-all duration-300
                ${
                  isSelected
                    ? "text-white shadow"
                    : "text-gray-200 hover:text-white hover:shadow-md"
                }`}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              animate={isSelected ? "selected" : "initial"}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-20">{cat.categoryName}</span>

              {/* Underline glow effect */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>

              {/* Glow overlay - separate and contained */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-md bg-yellow-500/10 pointer-events-none z-[-1]"
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
