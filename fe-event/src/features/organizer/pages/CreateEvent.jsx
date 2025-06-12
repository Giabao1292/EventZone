import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white">
      <h1 className="mt-6 text-3xl font-bold text-center text-gray-900 md:text-4xl">
        Không tìm thấy trang
      </h1>

      <p className="mt-3 text-base text-center text-gray-600 md:text-lg">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>

      <div className="mt-8">
        <button
          onClick={() => navigate("/home")} // Changed to /home for consistency
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Trở về trang chủ
        </button>
      </div>
    </div>
  );
};

export default CreateEvent;
