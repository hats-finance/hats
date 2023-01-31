import { IVaultDescription } from "types";
import axios from "axios";
import { getPath, setPath } from "utils/objects.utils";
import { VAULT_SERVICE } from "settings";
import { IEditedSessionResponse, IEditedVaultDescription } from "types";

function isBlob(uri: string) {
  return uri.startsWith("blob:");
}

async function pinFile(fileContents: any) {
  let data = new FormData();
  data.append("file", fileContents);

  const response = await axios.post(`${VAULT_SERVICE}/pinfile`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      chain: "rinkeby",
      safeaddress: "0x50e074Fe043b926aaA2aDA51AD282eE76081C318",
      address: "0x8F402318BB49776f5017d2FB12c90D0B0acAAaE8",
    },
  });

  return response.data.IpfsHash;
}

async function pinJson(object: any) {
  const response = await axios.post(`${VAULT_SERVICE}/pinjson`, object, {
    headers: {
      "Content-Type": "application/json",
      chain: "rinkeby",
      safeaddress: "0x50e074Fe043b926aaA2aDA51AD282eE76081C318",
      address: "0x8F402318BB49776f5017d2FB12c90D0B0acAAaE8",
    },
  });
  return response.data.IpfsHash;
}

export async function uploadVaultDescriptionToIpfs(vaultDescription: IVaultDescription): Promise<string> {
  const icons = ["project-metadata.icon", "project-metadata.tokenIcon"];

  vaultDescription.committee.members.map((member, index) => icons.push(`committee.members.${index}.image-ipfs-link`));

  for (const iconPath of icons) {
    const value = getPath(vaultDescription, iconPath);

    if (typeof value !== "string") continue;
    if (isBlob(value)) {
      const blob = await (await fetch(value)).blob();
      const IpfsHash = await pinFile(blob);
      setPath(vaultDescription, iconPath, `ipfs://${IpfsHash}`);
    }
  }

  const ipfsHash = await pinJson(vaultDescription);
  return ipfsHash;
}

export async function getSignatures(ipfsHash: string) {
  const response = await axios.get(`${VAULT_SERVICE}/signatures/${ipfsHash}`);
  return response.data;
}

export async function signIpfs(ipfsHash: string, address: string, message: string, signature: string) {
  const response = await axios.post(
    `${VAULT_SERVICE}/signipfs`,
    { ipfsHash, message, signature },
    {
      headers: {
        "Content-Type": "application/json",
        address: address,
      },
    }
  );
  return response.data;
}

export async function getEditSessionData(editSessionId: string): Promise<IEditedSessionResponse> {
  const response = await axios.get(`${VAULT_SERVICE}/edit-session/${editSessionId}`);
  return response.data;
}

export async function upsertEditSession(
  editSession: IEditedVaultDescription,
  editSessionId?: string
): Promise<string | IEditedSessionResponse> {
  const iconsPaths = ["project-metadata.icon", "project-metadata.tokenIcon"];
  editSession.committee.members.map((_, index) => iconsPaths.push(`committee.members.${index}.image-ipfs-link`));

  const formData = new FormData();

  for (const iconPath of iconsPaths) {
    const value = getPath(editSession, iconPath);

    if (typeof value !== "string") continue;
    if (isBlob(value)) {
      formData.append(iconPath, await (await fetch(value)).blob());
      setPath(editSession, iconPath, "");
    }
  }

  formData.append("editedDescription", JSON.stringify(editSession));

  const response = await axios.post(`${VAULT_SERVICE}/edit-session/${editSessionId ?? ""}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.headers["x-new-id"] ?? (response.data as IEditedSessionResponse);
}
