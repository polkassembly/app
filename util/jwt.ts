import { jwtDecode } from "jwt-decode";

// export interface ProfileData {
//   addresses: string[];
//   defaultAddress: string;
//   email: string;
//   isEmailVerified: boolean;
//   id: number;
//   roles: string[];
//   sub: string;
//   username: string;
//   web3signup: boolean;
//   issuedAt: number | null;
//   expiry: number | null;
// }

// /**
//  * Extracts and formats profile data from a JWT token.
//  * @param {string} token - The JWT token to decode.
//  * @returns {ProfileData | null} - The extracted profile data or null if the token is invalid.
//  */
// const getProfileDataFromToken = (token: string): ProfileData | null => {
//   try {

//     const decodedToken = jwtDecode<ProfileData & { iat: number; exp: number }>(token);

//     const profileData: ProfileData = {
//       addresses: decodedToken.addresses || [],
//       defaultAddress: decodedToken.defaultAddress || '',
//       email: decodedToken.email || '',
//       isEmailVerified: decodedToken.isEmailVerified || false,
//       id: decodedToken.id || 0,
//       roles: decodedToken.roles || [],
//       sub: decodedToken.sub || '',
//       username: decodedToken.username || '',
//       web3signup: decodedToken.web3signup || false,
//       issuedAt: decodedToken.iat || null,
//       expiry: decodedToken.exp || null,
//     };

//     return profileData;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error('Failed to decode token:', error.stack);
//     } else {
//       console.error('Failed to decode token:', error);
//     }
//     return null;
//   }
// };

function getIdFromToken(token: string): string | null {
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
