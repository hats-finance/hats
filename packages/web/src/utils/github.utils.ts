import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";

export const isGithubUsernameValid = async (username: string) => {
  const response = await fetch(`https://api.github.com/users/${username}`);
  return response.status === 200;
};

export const searchFileInHatsRepo = async (repoName: string, fileName: string): Promise<string[]> => {
  try {
    const res = await axiosClient.get(`${BASE_SERVICE_URL}/utils/search-file-in-repo?repoName=${repoName}&fileName=${fileName}`);

    return res.data.files ?? [];
  } catch (err) {
    console.error(err);
    throw new Error(`Error getting prices: ${err}`);
  }
};
