"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import { Plus, Loader2, Trash2 } from "lucide-react";
import {
  getBankList,
  addBankAccount,
  deleteBank,
  setDefaultBank,
} from "../../services/userServices";
import { useToast } from "../../hooks/use-toast";

export default function BankAccountManagement() {
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingBankId, setDeletingBankId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);
  const [newBank, setNewBank] = useState({
    bankName: "",
    accountNumber: "",
    holderName: "",
  });

  const vietnameseBanks = [
    "SACOMBANK",
    "VIETCOMBANK",
    "VIETINBANK",
    "BIDV",
    "AGRIBANK",
    "TECHCOMBANK",
    "MBBANK",
    "VPBANK",
    "ACB",
    "TPBank",
  ];

  const { toast } = useToast();

  // Fetch bank list on component mount
  useEffect(() => {
    fetchBankList();
  }, []);

  const fetchBankList = async () => {
    try {
      setLoading(true);
      const data = await getBankList();
      setBankAccounts(data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tài khoản ngân hàng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBank = async () => {
    if (!newBank.bankName || !newBank.accountNumber || !newBank.holderName) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await addBankAccount({
        bankName: newBank.bankName,
        accountNumber: newBank.accountNumber,
        holderName: newBank.holderName,
      });

      toast({
        title: "Thành công",
        description: "Thêm tài khoản ngân hàng thành công",
      });

      // Reset form and close dialog
      setNewBank({ bankName: "", accountNumber: "", holderName: "" });
      setIsAddBankOpen(false);

      // Refresh bank list
      await fetchBankList();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm tài khoản ngân hàng",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBank = async (paymentId) => {
    try {
      setDeletingBankId(paymentId);
      await deleteBank(paymentId);

      toast({
        title: "Thành công",
        description: "Xóa tài khoản ngân hàng thành công",
      });

      // Refresh bank list after successful deletion
      await fetchBankList();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa tài khoản ngân hàng",
        variant: "destructive",
      });
    } finally {
      setDeletingBankId(null);
    }
  };

  const handleSetDefault = async (paymentId) => {
    try {
      setSettingDefaultId(paymentId);
      await setDefaultBank(paymentId);

      toast({
        title: "Thành công",
        description: "Đã thiết lập tài khoản mặc định",
      });

      // Refresh bank list after successful default setting
      await fetchBankList();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thiết lập tài khoản mặc định",
        variant: "destructive",
      });
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Tài Khoản Ngân Hàng Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Tài Khoản Ngân Hàng Của Tôi
            </CardTitle>
            <Dialog open={isAddBankOpen} onOpenChange={setIsAddBankOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Thẻ Mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm Ngân Hàng Liên Kết</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin tài khoản ngân hàng của bạn
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Tên ngân hàng</Label>
                    <Select
                      value={newBank.bankName}
                      onValueChange={(value) =>
                        setNewBank({ ...newBank, bankName: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngân hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        {vietnameseBanks.map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Số tài khoản</Label>
                    <Input
                      id="account-number"
                      placeholder="1234567890"
                      value={newBank.accountNumber}
                      onChange={(e) =>
                        setNewBank({
                          ...newBank,
                          accountNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-holder">Tên chủ tài khoản</Label>
                    <Input
                      id="account-holder"
                      placeholder="NGUYEN VAN A"
                      value={newBank.holderName}
                      onChange={(e) =>
                        setNewBank({ ...newBank, holderName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddBankOpen(false)}
                    disabled={submitting}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleAddBank}
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang thêm...
                      </>
                    ) : (
                      "Thêm Tài Khoản"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {bankAccounts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Bạn chưa có tài khoản ngân hàng nào.
              </div>
            ) : (
              <div className="space-y-4">
                {bankAccounts.map((bank) => (
                  <div
                    key={bank.paymentId}
                    className="flex items-center justify-between p-4 border rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={`/placeholder.svg?height=60&width=60&text=${bank.bankName.substring(
                          0,
                          3
                        )}`}
                        alt="Bank logo"
                        className="w-16 h-16 rounded-lg border"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">
                            {bank.bankName}
                          </h3>
                          {bank.isDefault === 1 && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700"
                            >
                              Mặc Định
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Họ Và Tên: {bank.holderName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-mono">
                          *{bank.endAccountNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {/* Delete Button with Confirmation Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                            disabled={deletingBankId === bank.paymentId}
                          >
                            {deletingBankId === bank.paymentId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Xác nhận xóa tài khoản
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa tài khoản ngân hàng{" "}
                              <strong>{bank.bankName}</strong> -{" "}
                              <strong>*{bank.endAccountNumber}</strong> không?
                              <br />
                              <br />
                              Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBank(bank.paymentId)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Xóa tài khoản
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {bank.isDefault === 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(bank.paymentId)}
                          className="text-blue-600 hover:text-blue-700"
                          disabled={settingDefaultId === bank.paymentId}
                        >
                          {settingDefaultId === bank.paymentId ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Đang thiết lập...
                            </>
                          ) : (
                            "Thiết Lập Mặc Định"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
