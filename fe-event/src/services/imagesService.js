import apiClient from "../api/axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};
