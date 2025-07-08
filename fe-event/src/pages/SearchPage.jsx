"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import SearchBar from "../components/home/SearchBar";
import EventCard from "../ui/EventCard";
import { userSearchEvents } from "../services/eventService";
import { getCategories } from "../services/categoryService";
import { wishlistService } from "../services/wishlistServices";
import { toast } from "react-toastify";

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notification, setNotification] = useState(null);

  // Refs for positioning
  const dateButtonRef = useRef(null);
  const filterButtonRef = useRef(null);

  // States
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categories, setCategories] = useState([]);
  const [wishlistEventIds, setWishlistEventIds] = useState(new Set());

  // Filter states - Load from URL params
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return searchParams.get("location") || "all";
  });
  const [customLocation, setCustomLocation] = useState(() => {
    return searchParams.get("customLocation") || "";
  });
  const [dateRange, setDateRange] = useState(() => {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const dateLabel = searchParams.get("dateLabel");
    return {
      start: startDate || "",
      end: endDate || "",
      label: dateLabel || "All dates",
    };
  });
  const [isFree, setIsFree] = useState(() => {
    return searchParams.get("isFree") === "true";
  });
  const [priceRange, setPriceRange] = useState(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    return [
      minPrice ? Number.parseInt(minPrice) : 0,
      maxPrice ? Number.parseInt(maxPrice) : 10000000,
    ];
  });
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cats = searchParams.get("categories");
    return cats ? cats.split(",") : [];
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Active filters for display
  const [activeFilters, setActiveFilters] = useState([]);

  const locations = [
    { value: "all", label: "Tất cả địa điểm" },
    { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
  ];

  const datePresets = [
    { key: "all", label: "All dates" },
    { key: "today", label: "Today" },
    { key: "tomorrow", label: "Tomorrow" },
    { key: "weekend", label: "This weekend" },
    { key: "month", label: "This month" },
  ];

  const formatPriceRange = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}tr`;
    }
    return `${(value / 1000).toFixed(0)}k`;
  };

  const handleDatePreset = (preset) => {
    const today = new Date();
    let start = "";
    let end = "";
    const label = preset.label;

    switch (preset.key) {
      case "all":
        start = "";
        end = "";
        break;
      case "today":
        start = today.toISOString().split("T")[0];
        end = today.toISOString().split("T")[0];
        break;
      case "tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        start = tomorrow.toISOString().split("T")[0];
        end = tomorrow.toISOString().split("T")[0];
        break;
      case "weekend":
        const saturday = new Date(today);
        const daysUntilSaturday = (6 - today.getDay()) % 7;
        saturday.setDate(today.getDate() + daysUntilSaturday);
        const sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);
        start = saturday.toISOString().split("T")[0];
        end = sunday.toISOString().split("T")[0];
        break;
      case "month":
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        start = firstDay.toISOString().split("T")[0];
        end = lastDay.toISOString().split("T")[0];
        break;
    }

    setDateRange({ start, end, label });
  };

  const toggleFavorite = async (eventId) => {
    try {
      const updatedSet = new Set(wishlistEventIds);
      if (wishlistEventIds.has(eventId)) {
        await wishlistService.removeFromWishlist(eventId);
        updatedSet.delete(eventId);
        toast.info("Đã xóa khỏi danh sách yêu thích");
      } else {
        await wishlistService.addToWishlist(eventId);
        updatedSet.add(eventId);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
      setWishlistEventIds(updatedSet);
    } catch (error) {
      console.error("Failed to update wishlist:", error.message);
      toast.error("Lỗi khi cập nhật yêu thích");
    }
  };

  const [shouldTriggerSearch, setShouldTriggerSearch] = useState(false);

  useEffect(() => {
    if (shouldTriggerSearch) {
      handleSearch(searchQuery);
      setShouldTriggerSearch(false); // Reset lại sau khi search
    }
  }, [
    shouldTriggerSearch,
    selectedLocation,
    customLocation,
    dateRange,
    isFree,
    priceRange,
    selectedCategories,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Load categories and wishlist on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {}
    };

    const fetchWishlist = async () => {
      try {
        const wishlist = await wishlistService.getWishlist();
        const ids = new Set(wishlist.map((event) => event.id));
        setWishlistEventIds(ids);
      } catch (err) {
        console.error("Error loading wishlist:", err.message);
      }
    };

    fetchCategories();
    fetchWishlist();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
          dateButtonRef.current &&
          !dateButtonRef.current.contains(event.target) &&
          !event.target.closest(".date-dropdown")
      ) {
        setShowDatePicker(false);
      }
      if (
          filterButtonRef.current &&
          !filterButtonRef.current.contains(event.target) &&
          !event.target.closest(".filter-dropdown")
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    // Only save filter params, not search query
    if (selectedLocation !== "all") {
      params.set("location", selectedLocation);
    }
    if (customLocation) {
      params.set("customLocation", customLocation);
    }
    if (dateRange.start) {
      params.set("startDate", dateRange.start);
    }
    if (dateRange.end) {
      params.set("endDate", dateRange.end);
    }
    if (dateRange.label !== "All dates") {
      params.set("dateLabel", dateRange.label);
    }
    if (isFree) {
      params.set("isFree", "true");
    }
    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    }
    if (priceRange[1] < 10000000) {
      params.set("maxPrice", priceRange[1].toString());
    }
    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    }

    // Update URL without triggering navigation
    const newUrl = params.toString()
        ? `${location.pathname}?${params.toString()}`
        : location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [
    selectedLocation,
    customLocation,
    dateRange,
    isFree,
    priceRange,
    selectedCategories,
  ]);

  // Update active filters when filters change
  useEffect(() => {
    const filters = [];

    // Date filter
    if (dateRange.label !== "All dates") {
      filters.push({
        type: "date",
        label: dateRange.label,
        value: dateRange,
      });
    }

    // Location filter
    if (selectedLocation !== "all") {
      const locationLabel =
          selectedLocation === "other" ? customLocation : selectedLocation;
      filters.push({
        type: "location",
        label: locationLabel,
        value: selectedLocation,
      });
    }

    // Price filter
    if (isFree) {
      filters.push({
        type: "price",
        label: "Free",
        value: "free",
      });
    } else if (priceRange[0] > 0 || priceRange[1] < 10000000) {
      filters.push({
        type: "price",
        label: `${formatPriceRange(priceRange[0])} - ${formatPriceRange(
            priceRange[1]
        )}`,
        value: priceRange,
      });
    }

    // Category filters
    selectedCategories.forEach((categoryName) => {
      filters.push({
        type: "category",
        label: categoryName,
        value: categoryName,
      });
    });

    setActiveFilters(filters);
  }, [
    selectedLocation,
    customLocation,
    dateRange,
    isFree,
    priceRange,
    selectedCategories,
  ]);

  // Build search parameters - Use useCallback to prevent stale closure
  const buildSearchParams = useCallback(
      (currentSearchQuery) => {
        const params = [];

        // Only search for eventTitle, not city
        if (currentSearchQuery && currentSearchQuery.trim()) {
          params.push(`eventTitle:${currentSearchQuery.trim()}`);
        }

        if (selectedLocation !== "all") {
          const locationValue =
              selectedLocation === "other" ? customLocation : selectedLocation;
          if (locationValue) {
            params.push(`city:${locationValue}`);
          }
        }

        // Fix date search params

        if (dateRange.start && dateRange.end) {
          const adjustedEnd = new Date(dateRange.end);
          adjustedEnd.setDate(adjustedEnd.getDate() + 1);
          const endStr = adjustedEnd.toISOString().split("T")[0];

          params.push(`startTime<${endStr}`);

          const adjustedStart = new Date(dateRange.start);
          adjustedStart.setDate(adjustedStart.getDate() - 1);
          const startStr = adjustedStart.toISOString().split("T")[0];

          params.push(`endTime>${startStr}`);
        } else if (dateRange.end) {
          const adjustedEnd = new Date(dateRange.end);
          adjustedEnd.setDate(adjustedEnd.getDate() + 1);
          const endStr = adjustedEnd.toISOString().split("T")[0];

          params.push(`startTime<${endStr}`);
        } else if (dateRange.start) {
          const adjustedStart = new Date(dateRange.start);
          adjustedStart.setDate(adjustedStart.getDate() - 1);
          const startStr = adjustedStart.toISOString().split("T")[0];

          params.push(`endTime>${startStr}`);
        }

        if (isFree) {
          params.push(`price<1`);
        } else {
          if (priceRange[0] > 0) {
            params.push(`price>${priceRange[0] - 1}`);
          }
          if (priceRange[1] < 10000000) {
            params.push(`price<${priceRange[1] + 1}`);
          }
        }

        selectedCategories.forEach((categoryName) => {
          params.push(`categoryName:${categoryName}`);
        });

        return params;
      },
      [
        selectedLocation,
        customLocation,
        dateRange,
        isFree,
        priceRange,
        selectedCategories,
      ]
  );

  // Search function - Use useCallback and pass current query as parameter
  const handleSearch = useCallback(
      async (query) => {
        setLoading(true);

        // Update search query state immediately
        if (query !== undefined) {
          setSearchQuery(query);
        }

        // Use the passed query or current searchQuery
        const currentQuery = query !== undefined ? query : searchQuery;

        try {
          const searchParams = buildSearchParams(currentQuery);

          const results = await userSearchEvents(searchParams);
          setEvents(results);
        } catch (error) {
          console.error("Search error:", error);
          setEvents([]);
        } finally {
          setLoading(false);
        }
      },
      [buildSearchParams, searchQuery]
  );

  // Search function without loading state for initial load
  const handleSearchWithoutLoading = useCallback(
      async (query) => {
        // Update search query state immediately
        if (query !== undefined) {
          setSearchQuery(query);
        }

        // Use the passed query or current searchQuery
        const currentQuery = query !== undefined ? query : searchQuery;

        try {
          const searchParams = buildSearchParams(currentQuery);

          const results = await userSearchEvents(searchParams);
          setEvents(results);
        } catch (error) {
          console.error("Search error:", error);
          setEvents([]);
        }
      },
      [buildSearchParams, searchQuery]
  );

  const [initSearchFromURL, setInitSearchFromURL] = useState(false);

  useEffect(() => {
    if (initSearchFromURL) return;

    const searchParam = searchParams.get("search");
    const qParam = searchParams.get("q");
    const eventTitle = searchParams.get("eventTitle");

    let query = "";

    if (searchParam?.startsWith("eventTitle:")) {
      query = decodeURIComponent(searchParam.replace("eventTitle:", ""));
    } else if (qParam) {
      query = qParam;
    } else if (eventTitle) {
      query = eventTitle;
    }

    setSearchQuery(query);
    setTimeout(() => {
      handleSearchWithoutLoading(query);
    }, 0);

    setInitSearchFromURL(true);
  }, [searchParams, initSearchFromURL]);

  // Apply filters - Use current state values
  const applyFilters = useCallback(() => {
    setShowFilter(false);
    setShowDatePicker(false);
    handleSearch(searchQuery); // Pass current searchQuery explicitly
  }, [handleSearch, searchQuery]);

  const removeFilter = useCallback((filterToRemove) => {
    let filterChanged = false;

    switch (filterToRemove.type) {
      case "date":
        setDateRange({ start: "", end: "", label: "All dates" });
        filterChanged = true;
        break;
      case "location":
        setSelectedLocation("all");
        setCustomLocation("");
        filterChanged = true;
        break;
      case "price":
        if (filterToRemove.value === "free") {
          setIsFree(false);
        } else {
          setPriceRange([0, 10000000]);
        }
        filterChanged = true;
        break;
      case "category":
        setSelectedCategories((prev) =>
            prev.filter((cat) => cat !== filterToRemove.value)
        );
        filterChanged = true;
        break;
    }

    if (filterChanged) {
      setShouldTriggerSearch(true); // Giao cho useEffect xử lý
    }
  }, []);

  const resetAllFilters = useCallback(() => {
    setSelectedLocation("all");
    setCustomLocation("");
    setDateRange({ start: "", end: "", label: "All dates" });
    setIsFree(false);
    setPriceRange([0, 10000000]);
    setSelectedCategories([]);
    setSearchQuery("");

    navigate(location.pathname, { replace: true });

    setShouldTriggerSearch(true); // Trigger lại search sau khi reset
  }, [navigate, location.pathname]);

  return (
      <div className="min-h-screen text-white text-sm md:text-base relative overflow-hidden">
        {/* Header with Search */}
        {notification && (
            <div
                className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md z-50 transition-all ${
                    notification.type === "success" ? "bg-green-600" : "bg-red-600"
                }`}
            >
              <div className="flex items-center gap-2 text-sm">
                <span>{notification.message}</span>
                <button
                    onClick={() => setNotification(null)}
                    className="text-white hover:text-gray-300 font-bold"
                >
                  ×
                </button>
              </div>
            </div>
        )}
        <div className="relative z-10 text-center pt-16 pb-12">
          <p className="text-base md:text-lg mt-4 mb-10 text-gray-300 font-light">
            {searchQuery
                ? `Kết quả tìm kiếm cho "${searchQuery}"`
                : "Tìm kiếm sự kiện"}
          </p>
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
        </div>

        {/* Filter Bar */}
        <div className="relative z-20 px-6 mb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 relative">
              {/* Date Filter Button */}
              <div className="relative">
                <button
                    ref={dateButtonRef}
                    onClick={() => {
                      setShowDatePicker(!showDatePicker);
                      setShowFilter(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        dateRange.label !== "All dates"
                            ? "bg-green-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                >
                  <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                  >
                    <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                    />
                  </svg>
                  {dateRange.label}
                  {dateRange.label !== "All dates" && (
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDateRange({ start: "", end: "", label: "All dates" });
                            setShouldTriggerSearch(true);
                          }}
                          className="ml-1 hover:bg-green-700 rounded-full p-1"
                      >
                        <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                          <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                          />
                        </svg>
                      </button>
                  )}
                </button>

                {/* Date Picker Dropdown */}
                {showDatePicker && (
                    <div className="date-dropdown absolute top-full left-0 mt-2 bg-[#12141D] text-white rounded-lg p-6 w-96 z-50 shadow-xl border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Chọn thời gian</h3>
                        <button
                            onClick={() => setShowDatePicker(false)}
                            className="text-gray-400 hover:text-white"
                        >
                          <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                          >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Date Presets */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {datePresets.map((preset) => (
                            <button
                                key={preset.key}
                                onClick={() => handleDatePreset(preset)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                    dateRange.label === preset.label
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            >
                              {preset.label}
                            </button>
                        ))}
                      </div>

                      {/* Custom Date Range */}
                      <div className="space-y-3 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Từ ngày
                          </label>
                          <input
                              type="date"
                              value={dateRange.start}
                              onChange={(e) =>
                                  setDateRange((prev) => ({
                                    ...prev,
                                    start: e.target.value,
                                    label: "Custom",
                                  }))
                              }
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Đến ngày
                          </label>
                          <input
                              type="date"
                              value={dateRange.end}
                              onChange={(e) =>
                                  setDateRange((prev) => ({
                                    ...prev,
                                    end: e.target.value,
                                    label: "Custom",
                                  }))
                              }
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                            onClick={() => {
                              setDateRange({
                                start: "",
                                end: "",
                                label: "All dates",
                              });
                              setShowDatePicker(false);
                            }}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                          Reset
                        </button>
                        <button
                            onClick={applyFilters}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                )}
              </div>

              {/* Other Filters Button */}
              <div className="relative">
                <button
                    ref={filterButtonRef}
                    onClick={() => {
                      setShowFilter(!showFilter);
                      setShowDatePicker(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilters.filter((f) => f.type !== "date").length > 0
                            ? "bg-green-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                >
                  <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                  >
                    <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                        clipRule="evenodd"
                    />
                  </svg>
                  Filter
                </button>

                {/* Filter Dropdown */}
                {showFilter && (
                    <div className="filter-dropdown absolute top-full right-0 mt-2 bg-[#12141D] text-white rounded-lg p-6 w-80 max-h-[80vh] overflow-y-auto z-50 shadow-xl border border-gray-700">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Bộ lọc</h2>
                        <button
                            onClick={() => setShowFilter(false)}
                            className="text-gray-400 hover:text-white"
                        >
                          <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                          >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Location Filter */}
                      <div className="mb-6">
                        <h3 className="font-medium mb-3">Địa điểm</h3>
                        <div className="space-y-2">
                          {locations.map((location) => (
                              <label
                                  key={location.value}
                                  className="flex items-center cursor-pointer hover:bg-gray-700/30 p-1 rounded"
                              >
                                <input
                                    type="radio"
                                    name="location"
                                    value={location.value}
                                    checked={selectedLocation === location.value}
                                    onChange={(e) =>
                                        setSelectedLocation(e.target.value)
                                    }
                                    className="mr-3 w-4 h-4 text-green-600 bg-gray-700 border-gray-600 focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-200">
                            {location.label}
                          </span>
                              </label>
                          ))}

                          {/* Custom Location Input */}
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Địa điểm khác
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập địa điểm..."
                                value={customLocation}
                                onChange={(e) => {
                                  setCustomLocation(e.target.value);
                                  if (e.target.value.trim()) {
                                    setSelectedLocation("other");
                                  }
                                }}
                                onFocus={() => setSelectedLocation("other")}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Price Filter */}
                      <div className="mb-6">
                        <h3 className="font-medium mb-3">Giá vé</h3>
                        <div className="space-y-4">
                          <label className="flex items-center cursor-pointer hover:bg-gray-700/30 p-1 rounded">
                            <input
                                type="checkbox"
                                checked={isFree}
                                onChange={(e) => setIsFree(e.target.checked)}
                                className="mr-3 w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-200">Miễn phí</span>
                          </label>

                          {!isFree && (
                              <div>
                                <div className="flex justify-between text-sm text-gray-400 mb-4">
                                  <span>{formatPriceRange(priceRange[0])}</span>
                                  <span>{formatPriceRange(priceRange[1])}</span>
                                </div>

                                {/* Dual Range Slider */}
                                <div className="relative">
                                  <div className="relative h-2 bg-gray-700 rounded-lg">
                                    {/* Active track */}
                                    <div
                                        className="absolute h-2 bg-green-600 rounded-lg"
                                        style={{
                                          left: `${(priceRange[0] / 10000000) * 100}%`,
                                          width: `${
                                              ((priceRange[1] - priceRange[0]) /
                                                  10000000) *
                                              100
                                          }%`,
                                        }}
                                    />
                                  </div>

                                  {/* Min Range Input */}
                                  <input
                                      type="range"
                                      min="0"
                                      max="10000000"
                                      step="100000"
                                      value={priceRange[0]}
                                      onChange={(e) => {
                                        const value = Number.parseInt(e.target.value);
                                        if (value <= priceRange[1]) {
                                          setPriceRange([value, priceRange[1]]);
                                        }
                                      }}
                                      className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                                      style={{ zIndex: 1 }}
                                  />

                                  {/* Max Range Input */}
                                  <input
                                      type="range"
                                      min="0"
                                      max="10000000"
                                      step="100000"
                                      value={priceRange[1]}
                                      onChange={(e) => {
                                        const value = Number.parseInt(e.target.value);
                                        if (value >= priceRange[0]) {
                                          setPriceRange([priceRange[0], value]);
                                        }
                                      }}
                                      className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                                      style={{ zIndex: 2 }}
                                  />
                                </div>
                              </div>
                          )}
                        </div>
                      </div>

                      {/* Categories Filter */}
                      <div className="mb-6">
                        <h3 className="font-medium mb-3">Danh mục</h3>
                        {categories.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {categories.map((category) => (
                                  <button
                                      key={category.categoryId || category.id}
                                      onClick={() => {
                                        const categoryName =
                                            category.name || category.categoryName;
                                        if (selectedCategories.includes(categoryName)) {
                                          setSelectedCategories((prev) =>
                                              prev.filter((name) => name !== categoryName)
                                          );
                                        } else {
                                          setSelectedCategories((prev) => [
                                            ...prev,
                                            categoryName,
                                          ]);
                                        }
                                      }}
                                      className={`px-3 py-2 rounded-full text-sm transition-colors border ${
                                          selectedCategories.includes(
                                              category.name || category.categoryName
                                          )
                                              ? "bg-green-600 text-white border-green-600"
                                              : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border-gray-600"
                                      }`}
                                  >
                                    {category.name || category.categoryName}
                                  </button>
                              ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">
                              Đang tải danh mục...
                            </p>
                        )}
                      </div>

                      {/* Filter Actions */}
                      <div className="flex gap-3">
                        <button
                            onClick={() => {
                              setSelectedLocation("all");
                              setCustomLocation("");
                              setIsFree(false);
                              setPriceRange([0, 10000000]);
                              setSelectedCategories([]);
                            }}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                          Đặt lại
                        </button>
                        <button
                            onClick={applyFilters}
                            className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                          Áp dụng
                        </button>
                      </div>
                    </div>
                )}
              </div>

              {/* Active Filter Tags */}
              {activeFilters
                  .filter((f) => f.type !== "date")
                  .map((filter, index) => (
                      <div
                          key={`${filter.type}-${index}`}
                          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-full text-sm font-medium"
                      >
                        <span>{filter.label}</span>
                        <button
                            onClick={() => removeFilter(filter)}
                            className="hover:bg-green-700 rounded-full p-1"
                        >
                          <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                          >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="relative z-10 px-6 pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <p className="text-gray-400">
                {loading
                    ? "Đang tìm kiếm..."
                    : `Tìm thấy ${events.length} sự kiện`}
              </p>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                      <div
                          key={i}
                          className="bg-gray-800/50 rounded-xl overflow-hidden animate-pulse"
                      >
                        <div className="h-48 bg-gray-700/50"></div>
                        <div className="p-4">
                          <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
                          <div className="h-4 bg-gray-700/50 rounded w-2/3 mb-2"></div>
                          <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
                        </div>
                      </div>
                  ))}
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {events.map((event) => {
                    if (!event) return null;
                    return (
                        <EventCard
                            key={event.id}
                            event={event}
                            isFavorite={wishlistEventIds.has(event.id)}
                            onToggleFavorite={toggleFavorite}
                        />
                    );
                  })}
                </div>
            ) : (
                <div className="text-center py-12">
                  <svg
                      className="w-16 h-16 text-gray-600 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-1.01-6-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">
                    Không tìm thấy sự kiện nào
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                  </p>
                  <button
                      onClick={resetAllFilters}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
            )}
          </div>
        </div>

        <style>{`
  .slider-thumb::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #10b981;
    border: 2px solid #ffffff;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .slider-thumb::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #10b981;
    border: 2px solid #ffffff;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .slider-thumb::-webkit-slider-track {
    background: transparent;
  }

  .slider-thumb::-moz-range-track {
    background: transparent;
  }
`}</style>

        {/* Custom CSS for range slider */}
      </div>
  );
}