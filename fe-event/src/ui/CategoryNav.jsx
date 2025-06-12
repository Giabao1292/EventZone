import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryNav = ({ onSelectCategory, selectedCategoryId }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories"
        );

        // Kiểm tra nếu data là mảng thì mới set
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
    <div className="w-full bg-black bg-opacity-80 backdrop-blur-sm py-3">
      <div className="flex justify-center gap-6 px-6">
        {categories.map((cat) => (
          <button
            key={cat.categoryId}
            onClick={() => onSelectCategory?.(cat.categoryId)}
            className={`text-sm sm:text-base font-medium transition-colors duration-200
                            ${
                              selectedCategoryId === cat.categoryId
                                ? "text-emerald-400" // ✅ Đã bỏ underline
                                : "text-white hover:text-emerald-400"
                            }`}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
