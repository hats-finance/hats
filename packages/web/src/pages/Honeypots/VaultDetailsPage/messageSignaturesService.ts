import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";
import { MessageSignature } from "./types";

/**
 * Get all message signatures for a vault
 */
export async function getMessageSignatures(vaultId: string | undefined): Promise<MessageSignature[]> {
  if (!vaultId) return [];

  try {
    const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/message-sigs/${vaultId}`);
    const messageSignatures = response.data.signatures as MessageSignature[];

    return messageSignatures;
  } catch (error) {
    return [];
  }
}

/**
 * Collects a message signature for a vault
 */
export async function collectMessageSignature(
  vaultId: string | undefined,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  if (!vaultId) return false;

  const response = await axiosClient.post(`${BASE_SERVICE_URL}/edit-session/message-sigs/${vaultId}`, {
    signature,
    expectedAddress,
  });

  return response.status === 200;
}
