import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl flex overflow-hidden">
        {/* Left section - chỉ ẩn trên mobile */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-12 flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            CHÀO MỪNG BẠN
          </h1>
          <p className="text-base leading-relaxed text-white/90">
            Tạo tài khoản mới để bắt đầu hành trình khám phá và kết nối với
            những sự kiện hấp dẫn dành riêng cho bạn.
          </p>
        </div>

        {/* Right section */}
        <div className="w-full md:w-1/2 bg-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Đăng ký</h2>
            <p className="text-sm text-gray-500">Hãy tạo tài khoản mới ngay</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
