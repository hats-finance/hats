import { IVaultDescription } from "types/types";
import axios from "axios"
import { getPath, setPath } from "./objectUtils";
import { RoutePaths } from "constants/constants";
import { VAULT_SERVICE } from "settings";

function isBlob(uri: string) {
    return uri.startsWith("blob:")
}

async function pinFile(fileContents: any) {
    let data = new FormData()
    data.append("file", fileContents)


    const response = await axios
        .post(`${VAULT_SERVICE}/pinfile`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'chain': 'rinkeby',
                'safeaddress': '0x50e074Fe043b926aaA2aDA51AD282eE76081C318',
                'address': '0x8F402318BB49776f5017d2FB12c90D0B0acAAaE8'
            }
        })

    console.log('uploaded file', response.data)

    return response.data.IpfsHash
}

async function pinJson(object: any) {
    const response = await axios
        .post(`${VAULT_SERVICE}/pinjson`, object, {
            headers: {
                'Content-Type': 'application/json',
                'chain': 'rinkeby',
                'safeaddress': '0x50e074Fe043b926aaA2aDA51AD282eE76081C318',
                'address': '0x8F402318BB49776f5017d2FB12c90D0B0acAAaE8'
            }
        })
    return response.data.IpfsHash
}

export async function uploadVaultDescription(vaultDescription: IVaultDescription) {
    let icons = ["project-metadata.icon", "project-metadata.tokenIcon"]
    vaultDescription.committee.members.map((member, index) =>
        icons.push(`committee.members.${index}.image-ipfs-link`))
    for (const iconPath of icons) {
        const value = getPath(vaultDescription, iconPath)
        if (typeof value !== 'string') continue
        if (isBlob(value)) {
            const blob = await await (await fetch(value)).blob()
            const IpfsHash = await pinFile(blob)
            setPath(vaultDescription, iconPath, `ipfs://${IpfsHash}`)
        }
    }

    const ipfsHash = await pinJson(vaultDescription)
    window.location.href = `${RoutePaths.vault_editor}/${ipfsHash}`
}

export async function getSignatures(ipfsHash: string) {
    const response = await axios.get(`${VAULT_SERVICE}/signatures/${ipfsHash}`)
    return response.data
}

export async function signIpfs(ipfsHash: string, address: string, message: string, signature: string) {
    const response = await axios.post(`${VAULT_SERVICE}/signipfs`, { ipfsHash, message, signature },
        {
            headers: {
                'Content-Type': 'application/json',
                'address': address
            }
        })
    return response.data
}