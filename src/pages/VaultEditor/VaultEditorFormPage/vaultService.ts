import axios from "axios";
import { getPath, setPath } from "utils/objects.utils";
import { isBlob } from "utils/files.utils";
import { BASE_SERVICE_URL } from "settings";
import { IEditedSessionResponse, IEditedVaultDescription } from "types";

export async function getEditSessionData(editSessionId: string): Promise<IEditedSessionResponse> {
  const response = await axios.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}`);
  return response.data;
}

export async function upsertEditSession(
  editSession: IEditedVaultDescription | undefined,
  editSessionId: string | undefined
): Promise<string | IEditedSessionResponse> {
  const iconsPaths = ["project-metadata.icon", "project-metadata.tokenIcon"];
  editSession?.committee.members.map((_, index) => iconsPaths.push(`committee.members.${index}.image-ipfs-link`));

  const formData = new FormData();

  for (const iconPath of iconsPaths) {
    const value = getPath(editSession, iconPath);

    if (typeof value !== "string") continue;
    if (isBlob(value)) {
      formData.append(iconPath, await (await fetch(value)).blob());
      setPath(editSession, iconPath, "");
    }
  }

  if (editSession) formData.append("editedDescription", JSON.stringify(editSession));

  const response = await axios.post(`${BASE_SERVICE_URL}/edit-session/${editSessionId ?? ""}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.headers["x-new-id"] ?? (response.data as IEditedSessionResponse);
}
