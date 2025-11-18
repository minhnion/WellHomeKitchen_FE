import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    if (typeof exp !== "number") return true;
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
}
