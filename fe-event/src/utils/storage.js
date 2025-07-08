export const saveToken = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getToken = () => {
  return localStorage.getItem("accessToken");
};
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const removeToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};
