// src/components/DepositStep.jsx
import { CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";

const DepositStep = ({ eventData }) => {
  return (
    <div className="text-center space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2">
          Hoàn tất tạo sự kiện
        </h2>
        <p className="text-slate-600">Xác nhận và gửi sự kiện để phê duyệt</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-blue-200/50 shadow-2xl max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-700 mb-2">
            🎉 Sẵn sàng gửi phê duyệt!
          </h3>
          <p className="text-slate-600 text-lg">
            Sự kiện{" "}
            <span className="font-semibold text-blue-600">
              "{eventData?.eventTitle}"
            </span>{" "}
            đã sẵn sàng để gửi lên admin phê duyệt.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <h4 className="font-semibold text-blue-800 flex items-center gap-2">
            📋 Quy trình phê duyệt:
          </h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">1.</span>
              <span>Sự kiện sẽ được gửi đến admin để xem xét</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">2.</span>
              <span>Admin sẽ kiểm tra thông tin và nội dung sự kiện</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">3.</span>
              <span>Kết quả phê duyệt sẽ được thông báo qua email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">4.</span>
              <span>Bạn có thể theo dõi trạng thái trong trang quản lý</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm">
            <span className="font-semibold">⏰ Thời gian xử lý:</span> Thường từ
            1-3 ngày làm việc
          </p>
        </div>
        <div className="mt-6">
          <a
            href="/organizer"
            className="inline-block bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
          >
            Quản Lý Sự Kiện Của Tôi
          </a>
        </div>
      </div>
    </div>
  );
};

DepositStep.propTypes = {
  eventData: PropTypes.object.isRequired,
};

export default DepositStep;
