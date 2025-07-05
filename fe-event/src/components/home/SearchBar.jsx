import { useEffect, useState } from "react";

export default function SearchBar({ onSearch, initialValue = "" }) {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  // 👇 Sửa lỗi: đồng bộ lại initialValue khi props thay đổi
  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4">
      <form onSubmit={handleSearch} className="relative">
        <svg
          className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Bạn muốn xem gì?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 text-sm rounded-full bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </form>
    </div>
  );
}
