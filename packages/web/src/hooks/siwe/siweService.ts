import { SiweMessage } from "siwe";
import { BASE_SERVICE_URL } from "settings";
import { axiosClient } from "config/axiosClient";

/**
 * Gets a nonce for signing a message
 */
export async function getNonce(): Promise<string> {
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/siwe/nonce`, { withCredentials: true });
  return response.data;
}

/**
 * Verify a message signature with the server
 *
 * @param message - The Siwe message to verify
 * @param signature - The Siwe message signature
 */
export async function verifyMessage(message: SiweMessage, signature: string): Promise<boolean> {
  const response = await axiosClient.post(`${BASE_SERVICE_URL}/siwe/verify`, { message, signature }, { withCredentials: true });
  if (!response.data.ok) console.error(response.data.message);

  return response.data.ok;
}

/**
 * Logout the user from the server
 */
export async function logout(): Promise<boolean> {
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/siwe/logout`, { withCredentials: true });
  if (!response.data.ok) console.error(response.data.message);

  return response.data.ok;
}

/**
 * Get the current user profile
 */
export async function profile(): Promise<{ loggedIn: boolean; address?: string; chainId?: number }> {
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/siwe/me`, { withCredentials: true });
  if (!response.data.ok) return { loggedIn: false };

  return { loggedIn: true, address: response.data.address, chainId: response.data.chainId };
}
