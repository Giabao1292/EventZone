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
        <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto" />
        <h3 className="text-xl font-bold text-slate-700">
          Cảm ơn bạn đã gửi yêu cầu tạo sự kiện!
        </h3>
        <p className="text-slate-600 text-lg">
          Chúng tôi đã nhận được thông tin sự kiện{" "}
          <span className="font-semibold text-slate-700">
            "{eventData?.eventTitle}"
          </span>
          .
        </p>
        <p className="text-slate-600">
          Yêu cầu của bạn đang được xem xét. Chúng tôi sẽ liên hệ lại sau khi hệ
          thống xử lý thông tin.
        </p>
        <p className="text-slate-500 italic">
          Trong thời gian chờ đợi, bạn có thể theo dõi tiến trình hoặc chỉnh sửa
          sự kiện trong trang quản lý.
        </p>
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
