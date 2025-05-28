// 📄 src/pages/profiles/ProfileOrganizer.jsx
import React, { useState, useRef } from "react";
import { updateUser } from "../../services/userApi";
import "../../styles/profileLayout.css";

const ProfileOrganizer = ({ user, setUser }) => {
    const [formData, setFormData] = useState({ ...user });
    const fileInputRef = useRef();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updated = await updateUser(formData);
            setUser(updated);
            alert("Cập nhật thành công!");
        } catch (err) {
            alert("Lỗi cập nhật.");
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setUser((prevUser) => ({ ...prevUser, avatarUrl: imageUrl }));
        e.target.value = null;
    };

    const handleRemoveAvatar = (e) => {
        e.stopPropagation();
        setUser((prevUser) => ({ ...prevUser, avatarUrl: "" }));
    };

    return (
        <div className="profile-wrapper">
            <h2 className="profile-header">Thông tin Nhà tổ chức</h2>

            <div className="avatar-box-container">
                <label
                    className="avatar-box"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" />
                    ) : (
                        <span>Thêm ảnh</span>
                    )}
                </label>

                {user.avatarUrl && (
                    <button
                        className="remove-avatar"
                        type="button"
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
                    <label>Tên công ty</label>
                    <input
                        name="companyName"
                        value={formData.companyName || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Số điện thoại</label>
                    <input
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Địa chỉ</label>
                    <input
                        name="address"
                        value={formData.address || ""}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Cập nhật</button>
            </form>
        </div>
    );
};

export default ProfileOrganizer;
