import React, { useState, useRef } from "react";
import { updateUser } from "../../services/userApi";
import "../../styles/profileLayout.css";

const ProfileAdmin = ({ user, setUser }) => {
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
        setUser((prev) => ({ ...prev, profileUrl: imageUrl }));
        e.target.value = null;
    };

    const handleRemoveAvatar = (e) => {
        e.stopPropagation();
        setUser((prev) => ({ ...prev, profileUrl: "" }));
    };

    return (
        <div className="profile-wrapper">
            <h2 className="profile-header">Thông tin Admin</h2>

            <div className="avatar-box-container">
                <label className="avatar-box" onClick={() => fileInputRef.current.click()}>
                    {user.profileUrl ? (
                        <img src={user.profileUrl} alt="Avatar" />
                    ) : (
                        <span>Thêm ảnh</span>
                    )}
                </label>
                {user.profileUrl && (
                    <button className="remove-avatar" type="button" onClick={handleRemoveAvatar}>
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
                    <label>Email</label>
                    <input name="email" value={formData.email || ""} onChange={handleChange} />
                </div>

                <div>
                    <label>Trạng thái</label>
                    <div className="profile-form-readonly">
                        {user.status === 1 ? "Hoạt động" : "Khoá"}
                    </div>
                </div>

                {/*<div>*/}
                {/*    <label>Ngày tạo tài khoản</label>*/}
                {/*    <div className="profile-form-readonly">{user.createAt || "--"}</div>*/}
                {/*</div>*/}

                {/*<div>*/}
                {/*    <label>Ngày cập nhật</label>*/}
                {/*    <div className="profile-form-readonly">{user.updateAt || "--"}</div>*/}
                {/*</div>*/}

                <button type="submit">Cập nhật</button>
            </form>
        </div>
    );
};

export default ProfileAdmin;
