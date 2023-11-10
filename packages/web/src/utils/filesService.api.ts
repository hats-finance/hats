import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";

/**
 * Upload a file to the Database
 * @param file - The file to upload
 *
 * @returns The calculated IPFS hash of the uploaded file
 */
export const uploadFileToDB = async (file: File, pinDirectly = false): Promise<{ ipfsHash: string; name: string }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosClient.post(`${BASE_SERVICE_URL}/files/pinfile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        storage: pinDirectly ? "ipfs" : "db",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(`Unknown error: ${error}`);
  }
};
