"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
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
import {
  Plus,
  Loader2,
  Trash2,
  Mail,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import {
  getBankList,
  addBankAccount,
  deleteBank,
  setDefaultBank,
  sendBankVerificationCode,
} from "../../services/userServices";
import { useToast } from "../../hooks/use-toast";

export default function BankAccountManagement() {
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [deletingBankId, setDeletingBankId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [notification, setNotification] = useState(null); // Fallback notification
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

  // Auto hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Fetch bank list on component mount
  useEffect(() => {
    fetchBankList();
  }, []);

  // Fallback notification function
  const showNotification = (title, description, type = "info") => {
    console.log(`[${type.toUpperCase()}] ${title}: ${description}`);

    // Try toast first
    try {
      if (toast) {
        toast({
          title,
          description,
          variant: type === "error" ? "destructive" : "default",
          duration: type === "error" ? 7000 : 5000,
        });
      }
    } catch (error) {
      console.error("Toast error:", error);
    }

    // Fallback notification
    setNotification({
      title,
      description,
      type,
      timestamp: Date.now(),
    });

    // Also show browser alert as last resort
    if (type === "error") {
      setTimeout(() => {
        alert(`❌ ${title}\n${description}`);
      }, 100);
    }
  };

  const fetchBankList = async () => {
    try {
      setLoading(true);
      const data = await getBankList();
      setBankAccounts(data);
      console.log("Bank list loaded:", data);
    } catch (error) {
      console.error("Error fetching bank list:", error);
      showNotification(
        "Lỗi",
        "Không thể tải danh sách tài khoản ngân hàng",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      setSendingCode(true);
      console.log("Sending verification code...");

      showNotification(
        "Đang gửi mã...",
        "Đang gửi mã xác thực đến email của bạn",
        "info"
      );

      await sendBankVerificationCode();

      setIsCodeSent(true);
      setCountdown(60);

      console.log("Verification code sent successfully");
      showNotification(
        "Gửi mã thành công!",
        "Mã xác thực 6 ký tự đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư",
        "success"
      );
    } catch (error) {
      console.error("Error sending verification code:", error);

      let errorDescription = "Không thể gửi mã xác thực";
      if (error.message) {
        if (error.message.includes("email")) {
          errorDescription =
            "Email không hợp lệ hoặc không tồn tại trong hệ thống";
        } else if (
          error.message.includes("limit") ||
          error.message.includes("rate")
        ) {
          errorDescription =
            "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau";
        } else {
          errorDescription = error.message;
        }
      }

      showNotification("Gửi mã thất bại", errorDescription, "error");
    } finally {
      setSendingCode(false);
    }
  };

  const handleAddBank = async () => {
    console.log("Starting add bank process...");
    console.log("Form data:", { ...newBank, code: verificationCode });

    // Validation
    if (!newBank.bankName || !newBank.accountNumber || !newBank.holderName) {
      showNotification(
        "Thiếu thông tin",
        "Vui lòng điền đầy đủ thông tin ngân hàng",
        "error"
      );
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      showNotification(
        "Mã xác thực không hợp lệ",
        "Vui lòng nhập đầy đủ mã xác thực 6 ký tự",
        "error"
      );
      return;
    }

    try {
      setSubmitting(true);
      console.log("Submitting bank account...");

      showNotification(
        "Đang xử lý...",
        "Đang thêm tài khoản ngân hàng, vui lòng đợi",
        "info"
      );

      const bankData = {
        bankName: newBank.bankName,
        accountNumber: newBank.accountNumber,
        holderName: newBank.holderName,
        code: verificationCode,
        isDefault: bankAccounts.length === 0 ? 1 : 0,
      };

      console.log("Sending bank data:", bankData);

      const result = await addBankAccount(bankData);
      console.log("Add bank result:", result);

      // Success - close modal and show notification
      console.log("Bank account added successfully");

      showNotification(
        "Thêm tài khoản thành công!",
        `Tài khoản ${newBank.bankName} (*${newBank.accountNumber.slice(
          -4
        )}) đã được thêm vào hệ thống`,
        "success"
      );

      // Reset form and close dialog
      setNewBank({ bankName: "", accountNumber: "", holderName: "" });
      setVerificationCode("");
      setIsCodeSent(false);
      setCountdown(0);
      setIsAddBankOpen(false); // Close modal on success

      // Refresh bank list
      await fetchBankList();
    } catch (error) {
      console.error("Error adding bank account:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Detailed error handling
      let errorTitle = "Thêm tài khoản thất bại";
      let errorDescription = "Đã xảy ra lỗi khi thêm tài khoản ngân hàng";

      if (error.response?.data?.message) {
        errorDescription = error.response.data.message;
      } else if (error.message) {
        if (
          error.message.includes("verification") ||
          error.message.includes("code")
        ) {
          errorTitle = "Mã xác thực không đúng";
          errorDescription =
            "Mã xác thực không chính xác hoặc đã hết hạn. Vui lòng thử lại";
        } else if (
          error.message.includes("account") ||
          error.message.includes("duplicate")
        ) {
          errorTitle = "Tài khoản đã tồn tại";
          errorDescription = "Tài khoản ngân hàng này đã được đăng ký trước đó";
        } else if (error.message.includes("bank")) {
          errorTitle = "Thông tin ngân hàng không hợp lệ";
          errorDescription = error.message;
        } else {
          errorDescription = error.message;
        }
      }

      showNotification(errorTitle, errorDescription, "error");

      // Close modal on error as well
      setIsAddBankOpen(false);

      // Reset form
      setNewBank({ bankName: "", accountNumber: "", holderName: "" });
      setVerificationCode("");
      setIsCodeSent(false);
      setCountdown(0);
    } finally {
      setSubmitting(false);
      console.log("Add bank process completed");
    }
  };

  const handleDeleteBank = async (paymentId) => {
    try {
      setDeletingBankId(paymentId);
      await deleteBank(paymentId);

      showNotification(
        "Thành công",
        "Xóa tài khoản ngân hàng thành công",
        "success"
      );

      // Refresh bank list after successful deletion
      await fetchBankList();
    } catch (error) {
      console.error("Error deleting bank:", error);
      showNotification(
        "Lỗi",
        error.message || "Không thể xóa tài khoản ngân hàng",
        "error"
      );
    } finally {
      setDeletingBankId(null);
    }
  };

  const handleSetDefault = async (paymentId) => {
    try {
      setSettingDefaultId(paymentId);
      await setDefaultBank(paymentId);

      showNotification(
        "Thành công",
        "Đã thiết lập tài khoản mặc định",
        "success"
      );

      // Refresh bank list after successful default setting
      await fetchBankList();
    } catch (error) {
      console.error("Error setting default bank:", error);
      showNotification(
        "Lỗi",
        error.message || "Không thể thiết lập tài khoản mặc định",
        "error"
      );
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDialogClose = () => {
    console.log("Closing dialog...");
    setIsAddBankOpen(false);
    setNewBank({ bankName: "", accountNumber: "", holderName: "" });
    setVerificationCode("");
    setIsCodeSent(false);
    setCountdown(0);
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
      {/* Fallback Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div
            className={`p-4 rounded-lg shadow-lg border ${
              notification.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                {notification.type === "error" && (
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                )}
                {notification.type === "success" && (
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm mt-1">{notification.description}</p>
                </div>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

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
                    Nhập thông tin tài khoản ngân hàng và xác thực để thêm tài
                    khoản mới
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

                  {/* Verification Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Xác thực tài khoản
                      </Label>
                      {isCodeSent && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Đã gửi mã
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendVerificationCode}
                        disabled={sendingCode || countdown > 0}
                        className="flex-1"
                      >
                        {sendingCode ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Đang gửi...
                          </>
                        ) : countdown > 0 ? (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Gửi lại sau {countdown}s
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            {isCodeSent ? "Gửi lại mã" : "Gửi mã xác thực"}
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verification-code">
                        Mã xác thực (6 ký tự)
                      </Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={verificationCode}
                          onChange={setVerificationCode}
                          allowLetters={true}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Nhập mã 6 ký tự (chữ và số) được gửi đến email của bạn
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={handleDialogClose}
                    disabled={submitting}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleAddBank}
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={
                      submitting || !isCodeSent || verificationCode.length !== 6
                    }
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
