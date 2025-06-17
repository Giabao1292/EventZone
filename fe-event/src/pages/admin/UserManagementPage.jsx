"use client";

import { useState, useEffect } from "react";
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
  createRole,
} from "../../services/userServices";

export default function UserManagement() {
  // Replace the hardcoded ROLES_OPTIONS with dynamic state
  const [rolesOptions, setRolesOptions] = useState([]);
  const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
  });

  const [searchFilters, setSearchFilters] = useState({
    fullName: "",
    phone: "",
    email: "",
    ageFrom: "",
    ageTo: "",
    status: "",
    roles: "",
    scoreFrom: "",
    scoreTo: "",
  });

  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    email: "",
    status: 1,
    roles: [],
  });

  // Role creation states
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [roleFormData, setRoleFormData] = useState({
    role: "",
  });
  const [roleFormError, setRoleFormError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.number, pagination.size, sortBy, sortDirection]);

  // Add useEffect to fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const searchParams = buildSearchParams();
      const response = await getUserList({
        page: pagination.number,
        size: pagination.size,
        sort: `${sortBy},${sortDirection}`,
        search: searchParams,
      });

      setUsers(response.data.content);
      setPagination({
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        number: response.data.number,
        size: response.data.size,
      });
    } catch (error) {
      showNotification("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Add function to fetch roles from API
  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      // Assuming the API returns an array of role objects with 'name' property
      // Adjust this based on your actual API response structure
      const roleNames = response.data.map(
        (role) => role.name || role.roleName || role
      );
      setRolesOptions(roleNames);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      // Fallback to default roles if API fails
      setRolesOptions(["USER", "ADMIN", "ORGANIZER"]);
    }
  };

  const buildSearchParams = () => {
    const searchTerms = [];

    if (searchFilters.fullName) {
      searchTerms.push(`fullName:${searchFilters.fullName}`);
    }
    if (searchFilters.phone) {
      searchTerms.push(`phone:${searchFilters.phone}`);
    }
    if (searchFilters.email) {
      searchTerms.push(`email:${searchFilters.email}`);
    }
    if (searchFilters.status && searchFilters.status !== "all") {
      searchTerms.push(`status:${searchFilters.status}`);
    }
    if (searchFilters.roles && searchFilters.roles !== "all") {
      searchTerms.push(`roleName:${searchFilters.roles}`);
    }
    if (searchFilters.scoreFrom) {
      const from = Number.parseFloat(searchFilters.scoreFrom) - 1;
      searchTerms.push(`score>${from}`);
    }

    if (searchFilters.scoreTo) {
      const to = Number.parseFloat(searchFilters.scoreTo) + 1;
      searchTerms.push(`score<${to}`);
    }

    // Convert age to dateOfBirth
    if (searchFilters.ageFrom || searchFilters.ageTo) {
      const currentYear = new Date().getFullYear();
      if (searchFilters.ageFrom) {
        const dateFrom = new Date(
          currentYear - Number.parseInt(searchFilters.ageFrom) + 1,
          0,
          1
        );
        searchTerms.push(`dateOfBirth<${formatDate(dateFrom)}`);
      }
      if (searchFilters.ageTo) {
        const dateTo = new Date(
          currentYear - Number.parseInt(searchFilters.ageTo) - 1,
          11,
          31
        );
        searchTerms.push(`dateOfBirth>${formatDate(dateTo)}`);
      }
    }

    return searchTerms;
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, number: 0 }));
    fetchUsers();
  };

  const handleClearSearch = () => {
    setSearchFilters({
      fullName: "",
      phone: "",
      email: "",
      ageFrom: "",
      ageTo: "",
      status: "",
      roles: "",
      scoreFrom: "",
      scoreTo: "",
    });
    setPagination((prev) => ({ ...prev, number: 0 }));
    fetchUsers();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleCreateUser = async () => {
    setFormError(null);
    try {
      const userData = {
        ...formData,
        dateOfBirth: formatDateForInput(formData.dateOfBirth),
      };
      await createUser(userData);
      showNotification("User created successfully");
      setIsCreateModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Create user error:", error);

      // Extract error message from server response
      let errorMessage = "Failed to create user";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.join(", ");
        } else if (typeof errors === "object") {
          errorMessage = Object.values(errors).flat().join(", ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setFormError(errorMessage);
      showNotification("Failed to create user", "error");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setFormError(null);
    try {
      const userData = {
        ...formData,
        dateOfBirth: formatDateForInput(formData.dateOfBirth),
      };
      await updateUser(selectedUser.id, userData);
      showNotification("User updated successfully");
      setIsEditModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Update user error:", error);

      // Extract error message from server response
      let errorMessage = "Failed to update user";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.join(", ");
        } else if (typeof errors === "object") {
          errorMessage = Object.values(errors).flat().join(", ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setFormError(errorMessage);
      showNotification("Failed to update user", "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
      showNotification("User deleted successfully");
      fetchUsers();
    } catch (error) {
      showNotification("Failed to delete user", "error");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      password: "",
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      status: user.status,
      roles: user.roles,
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      password: "",
      phone: "",
      dateOfBirth: "",
      email: "",
      status: 1,
      roles: [],
    });
    setSelectedUser(null);
    setFormError(null);
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = 0;
    let endPage = pagination.totalPages - 1;

    if (pagination.totalPages > maxVisibleButtons) {
      // Calculate the start and end page numbers
      const halfVisible = Math.floor(maxVisibleButtons / 2);

      if (pagination.number < halfVisible) {
        // Near the start
        endPage = maxVisibleButtons - 1;
      } else if (pagination.number >= pagination.totalPages - halfVisible) {
        // Near the end
        startPage = pagination.totalPages - maxVisibleButtons;
      } else {
        // In the middle
        startPage = pagination.number - halfVisible;
        endPage = pagination.number + halfVisible;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPagination((prev) => ({ ...prev, number: i }))}
          className={`px-3 py-1 text-sm border rounded-md ${
            pagination.number === i
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i + 1}
        </button>
      );
    }

    return buttons;
  };

  // Helper function to render sort indicator
  const renderSortIndicator = (field) => {
    if (sortBy === field) {
      return sortDirection === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  // Role creation handlers
  const handleCreateRole = async () => {
    setRoleFormError(null);

    // Validate role name
    if (!roleFormData.role.trim()) {
      setRoleFormError("Role name is required");
      return;
    }

    try {
      await createRole(roleFormData.role.trim());
      showNotification("Role created successfully");
      setIsCreateRoleModalOpen(false);
      resetRoleForm();
      fetchRoles(); // Refresh roles list
    } catch (error) {
      console.error("Create role error:", error);

      let errorMessage = "Failed to create role";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.join(", ");
        } else if (typeof errors === "object") {
          errorMessage = Object.values(errors).flat().join(", ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setRoleFormError(errorMessage);
      showNotification("Failed to create role", "error");
    }
  };

  const resetRoleForm = () => {
    setRoleFormData({
      role: "",
    });
    setRoleFormError(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetRoleForm();
              setIsCreateRoleModalOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Role
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add User
          </button>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={searchFilters.fullName}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={searchFilters.phone}
              onChange={(e) =>
                setSearchFilters((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Search by phone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              value={searchFilters.email}
              onChange={(e) =>
                setSearchFilters((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Search by email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={searchFilters.status}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roles
            </label>
            <select
              value={searchFilters.roles}
              onChange={(e) =>
                setSearchFilters((prev) => ({ ...prev, roles: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {rolesOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age From
            </label>
            <input
              type="number"
              value={searchFilters.ageFrom}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  ageFrom: e.target.value,
                }))
              }
              placeholder="Min age"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age To
            </label>
            <input
              type="number"
              value={searchFilters.ageTo}
              onChange={(e) =>
                setSearchFilters((prev) => ({ ...prev, ageTo: e.target.value }))
              }
              placeholder="Max age"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Score From
            </label>
            <input
              type="number"
              value={searchFilters.scoreFrom}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  scoreFrom: e.target.value,
                }))
              }
              placeholder="Min score"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Score To
            </label>
            <input
              type="number"
              value={searchFilters.scoreTo}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  scoreTo: e.target.value,
                }))
              }
              placeholder="Max score"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
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
            Search
          </button>
          <button
            onClick={handleClearSearch}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Users ({pagination.totalElements})
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Page Size:
              </label>
              <select
                value={pagination.size.toString()}
                onChange={(e) => {
                  const newSize = Number.parseInt(e.target.value);
                  setPagination((prev) => ({
                    ...prev,
                    size: newSize,
                    number: 0,
                  }));
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[60px]"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size.toString()}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold">No.</th>
                <th
                  className="p-4 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("fullName")}
                >
                  Full Name {renderSortIndicator("fullName")}
                </th>
                <th
                  className="p-4 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("phone")}
                >
                  Phone {renderSortIndicator("phone")}
                </th>
                <th
                  className="p-4 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("email")}
                >
                  Email {renderSortIndicator("email")}
                </th>
                <th className="p-4 font-semibold">Age</th>
                <th
                  className="p-4 font-semibold cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("score")}
                >
                  Score {renderSortIndicator("score")}
                </th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Roles</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">
                      {pagination.number * pagination.size + index + 1}
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900">
                        {user.fullName}
                      </span>
                    </td>
                    <td className="p-4">{user.phone}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {calculateAge(user.dateOfBirth)} years
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDateForDisplay(user.dateOfBirth)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-blue-600">
                        {user.score}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {pagination.number * pagination.size + 1} to{" "}
              {Math.min(
                (pagination.number + 1) * pagination.size,
                pagination.totalElements
              )}{" "}
              of {pagination.totalElements} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    number: prev.number - 1,
                  }))
                }
                disabled={pagination.number === 0}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {renderPaginationButtons()}
              </div>

              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    number: prev.number + 1,
                  }))
                }
                disabled={pagination.number >= pagination.totalPages - 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <UserForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateUser}
              onCancel={() => setIsCreateModalOpen(false)}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              formError={formError}
              isEdit={false}
            />
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <UserForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdateUser}
              onCancel={() => setIsEditModalOpen(false)}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              formError={formError}
              isEdit={true}
            />
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Create New Role
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={roleFormData.role}
                  onChange={(e) =>
                    setRoleFormData({ role: e.target.value.toUpperCase() })
                  }
                  placeholder="Enter role name (e.g., MANAGER)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Role name will be automatically converted to uppercase
                </p>
              </div>

              {/* Error Message Display */}
              {roleFormError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error occurred
                      </h3>
                      <div className="mt-1 text-sm text-red-700">
                        <p>{roleFormError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateRole}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// User Form Component
function UserForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  showPassword,
  setShowPassword,
  formError,
  isEdit,
}) {
  const [rolesOptions, setRolesOptions] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        const roleNames = response.data.map(
          (role) => role.name || role.roleName || role
        );
        setRolesOptions(roleNames);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        setRolesOptions(["USER", "ADMIN", "ORGANIZER"]);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleChange = (role, checked) => {
    if (checked) {
      setFormData({ ...formData, roles: [...formData.roles, role] });
    } else {
      setFormData({
        ...formData,
        roles: formData.roles.filter((r) => r !== role),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            placeholder="Enter full name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Enter phone number"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password {!isEdit && "*"}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={
                isEdit
                  ? "Leave empty to keep current password"
                  : "Enter password"
              }
              required={!isEdit}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: Number.parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Roles *
        </label>
        <div className="flex flex-wrap gap-4">
          {rolesOptions.map((role) => (
            <label key={role} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.roles.includes(role)}
                onChange={(e) => handleRoleChange(role, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{role}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Error Message Display */}
      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error occurred
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{formError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          {isEdit ? "Update User" : "Create User"}
        </button>
      </div>
    </div>
  );
}
