import { SiweMessage } from "./../../../../../node_modules/siwe/lib/client";
import axios from "axios";
import { BASE_SERVICE_URL } from "settings";

/**
 * Gets a nonce for signing a message
 */
export async function getNonce(): Promise<string> {
  const response = await axios.get(`${BASE_SERVICE_URL}/siwe/nonce`);
  return response.data;
}

/**
 * Verify a message signature with the server
 *
 * @param message - The Siwe message to verify
 * @param signature - The Siwe message signature
 */
export async function verifyMessage(message: SiweMessage, signature: string): Promise<boolean> {
  const response = await axios.post(`${BASE_SERVICE_URL}/siwe/verify`, { message, signature });
  if (!response.data.ok) console.error(response.data.message);

  return response.data.ok;
}

/**
 * Logout the user from the server
 */
export async function logout(): Promise<boolean> {
  const response = await axios.get(`${BASE_SERVICE_URL}/siwe/logout`);
  if (!response.data.ok) console.error(response.data.message);

  return response.data.ok;
}

/**
 * Get the current user profile
 */
export async function profile(): Promise<{ loggedIn: boolean; address?: string; chainId?: number }> {
  const response = await axios.get(`${BASE_SERVICE_URL}/siwe/me`);
  if (!response.data.ok) return { loggedIn: false };

  return { loggedIn: true, address: response.data.address, chainId: response.data.chainId };
}
