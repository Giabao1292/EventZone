"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { voucherServices } from "../../services/voucherServices";

const initialFormData = {
  voucherCode: "",
  voucherName: "",
  description: "",
  requiredPoints: "",
  discountAmount: "",
  validFrom: "",
  validUntil: "",
  status: 1,
};

const initialSearchFilters = {
  voucherCode: "",
  voucherName: "",
  description: "",
  requiredPoints: "",
  requiredPointsOperator: ":",
  discountAmount: "",
  discountAmountOperator: ":",
  validFrom: "",
  validFromOperator: ":",
  validUntil: "",
  validUntilOperator: ":",
};

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    content: [],
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [searchFilters, setSearchFilters] = useState(initialSearchFilters);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchVouchers();
  }, [currentPage, pageSize, activeFilters]);

  // Build search parameters từ filters
  const buildSearchParams = (filters) => {
    const searchParams = [];

    if (filters.voucherCode) {
      searchParams.push(`voucherCode:${filters.voucherCode}`);
    }
    if (filters.voucherName) {
      searchParams.push(`voucherName:${filters.voucherName}`);
    }
    if (filters.description) {
      searchParams.push(`description:${filters.description}`);
    }
    if (filters.requiredPoints) {
      searchParams.push(
        `requiredPoints${filters.requiredPointsOperator}${filters.requiredPoints}`
      );
    }
    if (filters.discountAmount) {
      searchParams.push(
        `discountAmount${filters.discountAmountOperator}${filters.discountAmount}`
      );
    }
    if (filters.validFrom) {
      searchParams.push(
        `validFrom${filters.validFromOperator}${filters.validFrom}`
      );
    }
    if (filters.validUntil) {
      searchParams.push(
        `validUntil${filters.validUntilOperator}${filters.validUntil}`
      );
    }

    return searchParams;
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      // Sử dụng activeFilters thay vì searchFilters để đảm bảo consistency
      const searchParams =
        activeFilters.length > 0
          ? activeFilters
          : buildSearchParams(searchFilters);

      const response = await voucherServices.getVouchers(
        currentPage,
        pageSize,
        searchParams
      );

      // Kiểm tra response structure và xử lý dữ liệu
      if (response && response.code === 200 && response.data) {
        setVouchers(response.data);
      } else {
        // Nếu response không đúng format mong đợi
        throw new Error(response?.message || "Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);

      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Không thể tải danh sách voucher";

      if (error.response) {
        // Lỗi từ server (4xx, 5xx)
        if (error.response.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (error.response.status === 403) {
          errorMessage = "Bạn không có quyền truy cập tính năng này.";
        } else if (error.response.status >= 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau.";
        } else {
          errorMessage =
            error.response.data?.message || "Có lỗi xảy ra khi tải dữ liệu";
        }
      } else if (error.request) {
        // Lỗi network
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      }

      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });

      // Fallback to empty data
      setVouchers({
        totalElements: 0,
        totalPages: 0,
        number: currentPage,
        size: pageSize,
        content: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.voucherCode.trim()) {
      errors.voucherCode = "Mã voucher không được để trống";
    }

    if (!formData.voucherName.trim()) {
      errors.voucherName = "Tên voucher không được để trống";
    }

    if (!formData.description.trim()) {
      errors.description = "Mô tả không được để trống";
    }

    if (!formData.requiredPoints || formData.requiredPoints <= 0) {
      errors.requiredPoints = "Điểm yêu cầu phải lớn hơn 0";
    }

    if (!formData.discountAmount || formData.discountAmount <= 0) {
      errors.discountAmount = "Số tiền giảm phải lớn hơn 0";
    }

    if (!formData.validFrom) {
      errors.validFrom = "Ngày bắt đầu không được để trống";
    }

    if (!formData.validUntil) {
      errors.validUntil = "Ngày kết thúc không được để trống";
    }

    if (
      formData.validFrom &&
      formData.validUntil &&
      formData.validFrom >= formData.validUntil
    ) {
      errors.validUntil = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const voucherData = {
        ...formData,
        requiredPoints: Number.parseInt(formData.requiredPoints),
        discountAmount: Number.parseFloat(formData.discountAmount),
      };

      let response;
      if (editingVoucher) {
        response = await voucherServices.updateVoucher(
          editingVoucher.voucherId,
          voucherData
        );
        toast({
          title: "Thành công",
          description: "Cập nhật voucher thành công",
        });
      } else {
        response = await voucherServices.createVoucher(voucherData);
        toast({
          title: "Thành công",
          description: "Tạo voucher thành công",
        });
      }

      setIsDialogOpen(false);
      setEditingVoucher(null);
      setFormData(initialFormData);
      setFormErrors({});

      // Refresh data after successful operation
      await fetchVouchers();
    } catch (error) {
      console.error("Error submitting voucher:", error);

      let errorMessage = editingVoucher
        ? "Không thể cập nhật voucher"
        : "Không thể tạo voucher";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (error.response?.status === 403) {
        errorMessage = "Bạn không có quyền thực hiện thao tác này.";
      }

      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      voucherCode: voucher.voucherCode,
      voucherName: voucher.voucherName,
      description: voucher.description,
      requiredPoints: voucher.requiredPoints,
      discountAmount: voucher.discountAmount,
      validFrom: voucher.validFrom,
      validUntil: voucher.validUntil,
      status: voucher.status,
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = async (voucherId) => {
    setLoading(true);
    try {
      await voucherServices.updateVoucherStatus(voucherId, 0);
      toast({
        title: "Thành công",
        description: "Vô hiệu hóa voucher thành công",
      });

      // Refresh data after successful operation
      await fetchVouchers();
    } catch (error) {
      console.error("Error deleting voucher:", error);

      let errorMessage = "Không thể vô hiệu hóa voucher";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (error.response?.status === 403) {
        errorMessage = "Bạn không có quyền thực hiện thao tác này.";
      }

      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewVoucher = () => {
    setEditingVoucher(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleApplyFilters = () => {
    setActiveFilters(buildSearchParams(searchFilters));
    setCurrentPage(0);
    setIsAdvancedSearchOpen(false);
  };

  const handleClearFilters = () => {
    setSearchFilters(initialSearchFilters);
    setActiveFilters([]);
    setCurrentPage(0);
  };

  const removeFilter = (filterToRemove) => {
    const newActiveFilters = activeFilters.filter(
      (filter) => filter !== filterToRemove
    );
    setActiveFilters(newActiveFilters);

    // Update searchFilters state to match
    const newSearchFilters = { ...initialSearchFilters };
    newActiveFilters.forEach((filter) => {
      const [key, value] = filter.split(/[:><]/);
      if (key && value) {
        newSearchFilters[key] = value;
        if (filter.includes("<")) {
          newSearchFilters[`${key}Operator`] = "<";
        } else if (filter.includes(">")) {
          newSearchFilters[`${key}Operator`] = ">";
        }
      }
    });
    setSearchFilters(newSearchFilters);
    setCurrentPage(0);
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <Badge variant="default" className="bg-green-500">
        Hoạt động
      </Badge>
    ) : (
      <Badge variant="secondary">Không hoạt động</Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getFilterDisplayName = (filter) => {
    const [key, value] = filter.split(/[:><]/);
    const operator = filter.includes("<")
      ? " < "
      : filter.includes(">")
      ? " > "
      : ": ";

    const fieldNames = {
      voucherCode: "Mã voucher",
      voucherName: "Tên voucher",
      description: "Mô tả",
      requiredPoints: "Điểm yêu cầu",
      discountAmount: "Số tiền giảm",
      validFrom: "Ngày bắt đầu",
      validUntil: "Ngày kết thúc",
    };

    return `${fieldNames[key] || key}${operator}${value}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="container mx-auto p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Quản lý Voucher
              </CardTitle>
              <CardDescription>
                Quản lý danh sách voucher và ưu đãi của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Summary Stats */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {vouchers.totalElements}
                    </div>
                    <div className="text-sm text-blue-600">Tổng voucher</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {vouchers.content.filter((v) => v.status === 1).length}
                    </div>
                    <div className="text-sm text-green-600">Đang hoạt động</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {vouchers.content.filter((v) => v.status === 0).length}
                    </div>
                    <div className="text-sm text-gray-600">Không hoạt động</div>
                  </div>
                </div>
              </div>
              {/* Advanced Search */}
              <div className="space-y-4 mb-6">
                <Collapsible
                  open={isAdvancedSearchOpen}
                  onOpenChange={setIsAdvancedSearchOpen}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-transparent"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Tìm kiếm nâng cao
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isAdvancedSearchOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4 p-8 border rounded-lg bg-gray-50 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label>Mã voucher</Label>
                        <Input
                          placeholder="VD: NEWYEAR"
                          value={searchFilters.voucherCode}
                          onChange={(e) =>
                            setSearchFilters({
                              ...searchFilters,
                              voucherCode: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tên voucher</Label>
                        <Input
                          placeholder="VD: Ưu đãi năm mới"
                          value={searchFilters.voucherName}
                          onChange={(e) =>
                            setSearchFilters({
                              ...searchFilters,
                              voucherName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mô tả</Label>
                        <Input
                          placeholder="VD: Giảm giá"
                          value={searchFilters.description}
                          onChange={(e) =>
                            setSearchFilters({
                              ...searchFilters,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Điểm yêu cầu</Label>
                        <div className="flex gap-2">
                          <Select
                            value={searchFilters.requiredPointsOperator}
                            onValueChange={(value) =>
                              setSearchFilters({
                                ...searchFilters,
                                requiredPointsOperator: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=":">=</SelectItem>
                              <SelectItem value="<">{"<"}</SelectItem>
                              <SelectItem value=">">{">"}</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            placeholder="VD: 20"
                            value={searchFilters.requiredPoints}
                            onChange={(e) =>
                              setSearchFilters({
                                ...searchFilters,
                                requiredPoints: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Số tiền giảm</Label>
                        <div className="flex gap-2">
                          <Select
                            value={searchFilters.discountAmountOperator}
                            onValueChange={(value) =>
                              setSearchFilters({
                                ...searchFilters,
                                discountAmountOperator: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=":">=</SelectItem>
                              <SelectItem value="<">{"<"}</SelectItem>
                              <SelectItem value=">">{">"}</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            placeholder="VD: 15000"
                            value={searchFilters.discountAmount}
                            onChange={(e) =>
                              setSearchFilters({
                                ...searchFilters,
                                discountAmount: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Ngày bắt đầu</Label>
                        <div className="flex gap-2">
                          <Select
                            value={searchFilters.validFromOperator}
                            onValueChange={(value) =>
                              setSearchFilters({
                                ...searchFilters,
                                validFromOperator: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=":">Bằng</SelectItem>
                              <SelectItem value="<">Trước</SelectItem>
                              <SelectItem value=">">Sau</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="date"
                            value={searchFilters.validFrom}
                            onChange={(e) =>
                              setSearchFilters({
                                ...searchFilters,
                                validFrom: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Ngày kết thúc</Label>
                        <div className="flex gap-2">
                          <Select
                            value={searchFilters.validUntilOperator}
                            onValueChange={(value) =>
                              setSearchFilters({
                                ...searchFilters,
                                validUntilOperator: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=":">Bằng</SelectItem>
                              <SelectItem value="<">Trước</SelectItem>
                              <SelectItem value=">">Sau</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="date"
                            value={searchFilters.validUntil}
                            onChange={(e) =>
                              setSearchFilters({
                                ...searchFilters,
                                validUntil: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 py-8">
                      <Button onClick={handleApplyFilters}>
                        <Search className="h-4 w-4 mr-2" />
                        Áp dụng bộ lọc
                      </Button>
                      <Button variant="outline" onClick={handleClearFilters}>
                        Xóa bộ lọc
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">
                      Bộ lọc đang áp dụng:
                    </span>
                    {activeFilters.map((filter, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {getFilterDisplayName(filter)}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeFilter(filter)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Label htmlFor="pageSize">Hiển thị:</Label>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) =>
                      setPageSize(Number.parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500">
                    voucher mỗi trang
                  </span>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleNewVoucher}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Voucher
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingVoucher
                          ? "Chỉnh sửa Voucher"
                          : "Thêm Voucher mới"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingVoucher
                          ? "Cập nhật thông tin voucher"
                          : "Điền thông tin để tạo voucher mới"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="voucherCode">Mã Voucher *</Label>
                          <Input
                            id="voucherCode"
                            value={formData.voucherCode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                voucherCode: e.target.value,
                              })
                            }
                            placeholder="VD: NEWYEAR2026"
                            className={
                              formErrors.voucherCode ? "border-red-500" : ""
                            }
                          />
                          {formErrors.voucherCode && (
                            <p className="text-sm text-red-500">
                              {formErrors.voucherCode}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="voucherName">Tên Voucher *</Label>
                          <Input
                            id="voucherName"
                            value={formData.voucherName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                voucherName: e.target.value,
                              })
                            }
                            placeholder="VD: Ưu đãi năm mới"
                            className={
                              formErrors.voucherName ? "border-red-500" : ""
                            }
                          />
                          {formErrors.voucherName && (
                            <p className="text-sm text-red-500">
                              {formErrors.voucherName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Mô tả *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Mô tả chi tiết về voucher"
                          className={
                            formErrors.description ? "border-red-500" : ""
                          }
                        />
                        {formErrors.description && (
                          <p className="text-sm text-red-500">
                            {formErrors.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="requiredPoints">Điểm yêu cầu *</Label>
                          <Input
                            id="requiredPoints"
                            type="number"
                            value={formData.requiredPoints}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                requiredPoints: e.target.value
                                  ? Number.parseInt(e.target.value)
                                  : "",
                              })
                            }
                            placeholder="VD: 20"
                            className={
                              formErrors.requiredPoints ? "border-red-500" : ""
                            }
                          />
                          {formErrors.requiredPoints && (
                            <p className="text-sm text-red-500">
                              {formErrors.requiredPoints}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discountAmount">
                            Số tiền giảm (VND) *
                          </Label>
                          <Input
                            id="discountAmount"
                            type="number"
                            value={formData.discountAmount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                discountAmount: e.target.value
                                  ? Number.parseFloat(e.target.value)
                                  : "",
                              })
                            }
                            placeholder="VD: 15000"
                            className={
                              formErrors.discountAmount ? "border-red-500" : ""
                            }
                          />
                          {formErrors.discountAmount && (
                            <p className="text-sm text-red-500">
                              {formErrors.discountAmount}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="validFrom">Ngày bắt đầu *</Label>
                          <Input
                            id="validFrom"
                            type="date"
                            value={formData.validFrom}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                validFrom: e.target.value,
                              })
                            }
                            className={
                              formErrors.validFrom ? "border-red-500" : ""
                            }
                          />
                          {formErrors.validFrom && (
                            <p className="text-sm text-red-500">
                              {formErrors.validFrom}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="validUntil">Ngày kết thúc *</Label>
                          <Input
                            id="validUntil"
                            type="date"
                            value={formData.validUntil}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                validUntil: e.target.value,
                              })
                            }
                            className={
                              formErrors.validUntil ? "border-red-500" : ""
                            }
                          />
                          {formErrors.validUntil && (
                            <p className="text-sm text-red-500">
                              {formErrors.validUntil}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select
                          value={formData.status.toString()}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              status: Number.parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Hoạt động</SelectItem>
                            <SelectItem value="0">Không hoạt động</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading
                            ? "Đang xử lý..."
                            : editingVoucher
                            ? "Cập nhật"
                            : "Tạo mới"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Vouchers Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã Voucher</TableHead>
                      <TableHead>Tên Voucher</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Điểm yêu cầu</TableHead>
                      <TableHead>Giảm giá</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                            Đang tải...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : vouchers.content.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-gray-500">
                            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            {activeFilters.length > 0
                              ? "Không tìm thấy voucher nào với bộ lọc này"
                              : "Không có voucher nào"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      vouchers.content.map((voucher) => (
                        <TableRow
                          key={voucher.voucherId}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-medium font-mono text-blue-600">
                            {voucher.voucherCode}
                          </TableCell>
                          <TableCell className="font-medium">
                            {voucher.voucherName}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div
                              className="truncate"
                              title={voucher.description}
                            >
                              {voucher.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">
                                {voucher.requiredPoints}
                              </span>
                              <span className="text-sm text-gray-500">
                                điểm
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">
                            {formatCurrency(voucher.discountAmount)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(voucher.validFrom)}</span>
                              </div>
                              <div className="text-gray-500 pl-4">
                                đến {formatDate(voucher.validUntil)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(voucher.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(voucher)}
                                className="hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {voucher.status === 1 && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 bg-transparent"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Xác nhận vô hiệu hóa
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Bạn có chắc chắn muốn vô hiệu hóa
                                        voucher{" "}
                                        <strong>"{voucher.voucherName}"</strong>
                                        ? Voucher sẽ không thể sử dụng sau khi
                                        vô hiệu hóa.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDelete(voucher.voucherId)
                                        }
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Vô hiệu hóa
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {vouchers.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                  <div className="text-sm text-gray-500">
                    Hiển thị{" "}
                    <span className="font-medium">
                      {vouchers.content.length}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-medium">
                      {vouchers.totalElements}
                    </span>{" "}
                    voucher
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.max(0, currentPage - 1))
                      }
                      disabled={currentPage === 0 || loading}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(vouchers.totalPages, 5) },
                        (_, i) => {
                          let pageNumber;
                          if (vouchers.totalPages <= 5) {
                            pageNumber = i;
                          } else if (currentPage < 3) {
                            pageNumber = i;
                          } else if (currentPage > vouchers.totalPages - 4) {
                            pageNumber = vouchers.totalPages - 5 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={
                                pageNumber === currentPage
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(pageNumber)}
                              disabled={loading}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber + 1}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(
                          Math.min(vouchers.totalPages - 1, currentPage + 1)
                        )
                      }
                      disabled={
                        currentPage === vouchers.totalPages - 1 || loading
                      }
                      className="flex items-center gap-1"
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
