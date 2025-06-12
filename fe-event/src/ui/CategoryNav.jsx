import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryNav = ({ onSelectCategory, selectedCategoryId }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/categories")
            .then(res => {
                if (Array.isArray(res.data)) {
                    setCategories(res.data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="w-full bg-black bg-opacity-80 backdrop-blur-sm py-3">
            <div className="flex justify-center gap-6 px-6">
                {categories.map((cat) => (
                    <button
                        key={cat.categoryId}
                        onClick={() => onSelectCategory?.(cat.categoryId)}
                        className={`text-sm sm:text-base font-medium transition-colors duration-200
                            ${selectedCategoryId === cat.categoryId
                            ? "text-emerald-400" // ✅ Đã bỏ underline
                            : "text-white hover:text-emerald-400"}`}
                    >
                        {cat.categoryName}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryNav;
