import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaDiscord,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-[#393e46] text-white text-sm">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-[#444] pb-8">
          {/* Cột 1 */}
          <div>
            <h4 className="font-bold mb-2">Hotline</h4>
            <p className="text-green-400 font-bold mb-2">1900.6408</p>
            <h4 className="font-bold mb-2">Email</h4>
            <div className="flex items-center mb-2">
              <FiMail className="mr-2" />
              <span>support@ticketbox.vn</span>
            </div>
            <h4 className="font-bold mb-2">Văn phòng</h4>
            <div className="flex items-start">
              <MdLocationOn className="mr-2 mt-1" />
              <span>
                Lầu 12, 17 Bà Huyện Thanh Quan, Phường 6, Quận 3, TP. Hồ Chí
                Minh
              </span>
            </div>
          </div>
          {/* Cột 2 */}
          <div>
            <h4 className="font-bold mb-2">Dành cho Khách hàng</h4>
            <p className="mb-2 cursor-pointer hover:underline">
              Điều khoản sử dụng cho khách hàng
            </p>
            <h4 className="font-bold mb-2">Dành cho Ban Tổ chức</h4>
            <p className="cursor-pointer hover:underline">
              Điều khoản sử dụng cho ban tổ chức
            </p>
          </div>
          {/* Cột 3 */}
          <div>
            <h4 className="font-bold mb-2">Về công ty chúng tôi</h4>
            <ul className="space-y-1">
              <li className="cursor-pointer hover:underline">
                Quy chế hoạt động
              </li>
              <li className="cursor-pointer hover:underline">
                Chính sách bảo mật thông tin
              </li>
              <li className="cursor-pointer hover:underline">
                Cơ chế giải quyết tranh chấp/ khiếu nại
              </li>
              <li className="cursor-pointer hover:underline">
                Chính sách bảo mật thanh toán
              </li>
              <li className="cursor-pointer hover:underline">
                Chính sách đổi trả và kiểm hàng
              </li>
              <li className="cursor-pointer hover:underline">
                Điều kiện vận chuyển và giao nhận
              </li>
              <li className="cursor-pointer hover:underline">
                Phương thức thanh toán
              </li>
            </ul>
          </div>
          {/* Cột 4 */}
          <div>
            <h4 className="font-bold mb-2">Follow us</h4>
            <div className="flex space-x-3 mb-4 text-xl">
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="TikTok">
                <FaTiktok />
              </a>
              <a href="#" aria-label="Discord">
                <FaDiscord />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
            <h4 className="font-bold mb-2">Ngôn ngữ</h4>
            <div className="flex space-x-2 text-2xl">
              <span role="img" aria-label="Vietnam">
                🇻🇳
              </span>
              <span role="img" aria-label="English">
                🇬🇧
              </span>
            </div>
          </div>
        </div>
        {/* Thông tin pháp lý */}
        <div className="text-xs text-gray-400 mt-4">
          <div className="mb-1">Công ty TNHH Ticketbox</div>
          <div>
            Địa chỉ: Tầng 12, Tòa nhà Viettel, 285 Cách Mạng Tháng Tám, Phường
            12, Quận 10, TP. Hồ Chí Minh
          </div>
          <div>Hotline: 1900.6408 - Email: support@ticketbox.vn</div>
          <div>
            Giấy chứng nhận đăng ký doanh nghiệp số: 0313605444, cấp lần đầu
            ngày 07/01/2016 bởi Sở Kế Hoạch và Đầu Tư TP. Hồ Chí Minh
          </div>
        </div>
      </div>
    </footer>
  );
}
