import { jwtDecode } from "jwt-decode";

function getIdFromToken(token: string): string | null {
  if(!token) return null;
  try {
    const decodedToken = jwtDecode<{ id: number }>(token);
    if (!decodedToken.id) {
      return null;
    }
    return String(decodedToken.id);
  }catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

export default getIdFromToken;
