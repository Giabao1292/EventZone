import axiosInstance from "./axiosInstance";

export const getUser = async () => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
};

export const updateUser = async (user) => {
    const response = await axiosInstance.put("/users/me", user);
    return response.data;
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axiosInstance.post("/users/me/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

