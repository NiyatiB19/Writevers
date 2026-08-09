const API_ORIGIN =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5001" : "");

export const apiUrl = (path) => `${API_ORIGIN}${path}`;
export const homeApiUrl = (path = "") => apiUrl(`/api/home${path}`);
