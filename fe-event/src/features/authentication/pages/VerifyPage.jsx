import VerifyForm from "../components/VerifyForm";

const VerifyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl flex overflow-hidden">
        {/* Left - Giới thiệu */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-500 text-white p-10 flex-col justify-center">
          <h1 className="text-3xl font-extrabold mb-4">XÁC THỰC EMAIL</h1>
          <p className="text-sm leading-relaxed text-white/90">
            Vui lòng kiểm tra email để nhận mã xác minh và hoàn tất đăng ký.
          </p>
        </div>

        {/* Right - Form nhập mã & mật khẩu */}
        <div className="w-full md:w-1/2 bg-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Xác thực tài khoản
            </h2>
            <p className="text-sm text-gray-500">Nhập mã và đặt mật khẩu</p>
          </div>
          <VerifyForm />
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
