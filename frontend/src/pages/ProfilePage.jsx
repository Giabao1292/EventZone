import React, { useEffect, useState } from "react";
import { getUser } from "../services/userApi"; // Giữ lại import này
import ProfileAdmin from "./profiles/ProfileAdmin";
import ProfileUser from "./profiles/ProfileUser";
import ProfileOrganizer from "./profiles/ProfileOrganizer";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUser(); // gọi API từ backend
                setUser(data);
            } catch (error) {
                console.error("Lỗi lấy thông tin người dùng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <p>Đang tải...</p>;
    if (!user) return <p>Không tìm thấy thông tin người dùng.</p>;

    switch (user.role) {
        case "admin":
            return <ProfileAdmin user={user} setUser={setUser} />;
        case "organizer":
            return <ProfileOrganizer user={user} setUser={setUser} />;
        default:
            return <ProfileUser user={user} setUser={setUser} />;
    }
};

export default ProfilePage;
