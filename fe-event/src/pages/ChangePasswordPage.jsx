import { useForm } from "react-hook-form";
import { changePassword } from "../services/userServices";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const ChangePasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    try {
      const response = await changePassword(data);
      if (response.code === 200) {
        toast.success("Đổi mật khẩu thành công!");
        reset();
      } else {
        toast.error(response.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100"
      >
        <h2 className="text-4xl font-bold text-indigo-700 text-center">
          Đổi mật khẩu
        </h2>

        <Field
          label="Mật khẩu hiện tại"
          name="oldPassword"
          type="password"
          register={register}
          error={errors.oldPassword?.message}
          required
        />

        <Field
          label="Mật khẩu mới"
          name="newPassword"
          type="password"
          register={register}
          error={errors.newPassword?.message}
          required
        />

        <Field
          label="Nhập lại mật khẩu mới"
          name="confirmNewPassword"
          type="password"
          register={register}
          error={errors.confirmNewPassword?.message}
          required
        />

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl"
          >
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({
  label,
  register,
  name,
  type = "text",
  error,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        {...register(
          name,
          required ? { required: `${label} không được để trống` } : {}
        )}
        className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
};

export default ChangePasswordForm;
