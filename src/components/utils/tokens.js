export const getToken = () => {
  return localStorage.getItem("access_token");
};
export const setToken = (value) => {
  localStorage.setItem("access_token", value);
};
export const removeToken = () => {
  localStorage.removeItem("access_token");
};
export const setRole = (value) => {
  localStorage.setItem("role", value);
};
export const getRole = () => {
  return localStorage.getItem("role");
};
