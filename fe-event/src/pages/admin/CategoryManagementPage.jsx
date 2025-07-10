import { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: null, name: "" });
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/categories");
      console.log("Fetched categories:", res.data);
      setCategories(res.data.data || []);
    } catch {
      toast.error("Không thể tải danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      categoryName: form.name,
    };

    try {
      if (form.id) {
        await apiClient.put(`/categories/${form.id}`, payload);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await apiClient.post("/categories", payload);
        toast.success("Thêm danh mục thành công");
      }

      setForm({ id: null, name: "" });
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      toast.error("Đã xảy ra lỗi khi gửi dữ liệu");
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/categories/${id}`);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Đã xảy ra lỗi khi xóa");
    }
  };

  const handleEdit = (cat) => {
    setForm({ id: cat.categoryId, name: cat.categoryName });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Tên danh mục"
          className="border px-4 py-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {form.id ? "Cập nhật" : "Thêm mới"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={() => setForm({ id: null, name: "" })}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Hủy
          </button>
        )}
      </form>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Tên danh mục</th>
            <th className="px-4 py-2 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.categoryId}>
              <td className="px-4 py-2 border">{cat.categoryId}</td>
              <td className="px-4 py-2 border">{cat.categoryName}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(cat)}
                  className="px-3 py-1 bg-yellow-400 rounded mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(cat.categoryId)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
