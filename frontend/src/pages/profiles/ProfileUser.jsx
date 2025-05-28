import React, { useState, useRef } from "react";
import "../../styles/profileLayout.css";

const ProfileUser = ({ user, setUser }) => {
        const [formData, setFormData] = useState({ ...user });
        const fileInputRef = useRef();

        const handleChange = (e) => {
                setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                try {
                        // Đây là demo: chỉ cập nhật local, không gọi API
                        setUser({ ...formData });
                        alert("Cập nhật thành công!");
                } catch (err) {
                        alert("Lỗi cập nhật.");
                }
        };

        const handleAvatarChange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const imageUrl = URL.createObjectURL(file);
                setUser((prev) => ({ ...prev, profileUrl: imageUrl }));
                e.target.value = null;
        };

        const handleRemoveAvatar = (e) => {
                e.stopPropagation();
                setUser((prev) => ({ ...prev, profileUrl: "" }));
        };

        return (
            <div className="profile-wrapper">
                    <h2 className="profile-header">Thông tin người dùng</h2>

                    <div className="avatar-box-container">
                            <label
                                className="avatar-box"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                    {user.profileUrl ? (
                                        <img src={user.profileUrl} alt="Avatar" />
                                    ) : (
                                        <span>Thêm ảnh</span>
                                    )}
                            </label>

                            {user.profileUrl && (
                                <button
                                    type="button"
                                    className="remove-avatar"
                                    onClick={handleRemoveAvatar}
                                >
                                        &times;
                                </button>
                            )}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: "none" }}
                    />

                    <form className="profile-form" onSubmit={handleSubmit}>
                            <div>
                                    <label>Username</label>
                                    <input name="username" value={formData.username || ""} disabled />
                            </div>
                            <div>
                                    <label>Họ tên</label>
                                    <input name="fullName" value={formData.fullName || ""} onChange={handleChange} />
                            </div>
                            <div>
                                    <label>Email</label>
                                    <input name="email" value={formData.email || ""} onChange={handleChange} />
                            </div>
                            <div>
                                    <label>Số điện thoại</label>
                                    <input name="phone" value={formData.phone || ""} onChange={handleChange} />
                            </div>
                            <div>
                                    <label>Ngày sinh</label>
                                    <input type="date" name="birthDate" value={formData.birthDate || ""} onChange={handleChange} />
                            </div>
                            <div>
                                    <label>Điểm uy tín</label>
                                    <div className="profile-form-readonly">{user.score || 0}</div>
                            </div>
                            <div>
                                    <label>Trạng thái</label>
                                    <div className="profile-form-readonly">
                                            {user.status === 1 ? "Hoạt động" : "Khoá"}
                                    </div>
                            </div>
                            <button type="submit">Cập nhật</button>
                    </form>
            </div>
        );
};

export default ProfileUser;
