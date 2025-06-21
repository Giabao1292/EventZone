import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl flex overflow-hidden">
        {/* Left section - Welcome message */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-12 flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            CHÀO MỪNG BẠN
          </h1>
          <p className="text-base leading-relaxed text-white/90">
            Đăng nhập để tiếp tục hành trình kết nối tri thức và khám phá những
            sự kiện đặc biệt được tổ chức dành riêng cho bạn.
          </p>
        </div>

        {/* Right section - Login form */}
        <div className="w-full md:w-1/2 bg-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Đăng nhập tài khoản
            </h2>
            <p className="text-sm text-gray-500">Chào mừng bạn quay trở lại</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
