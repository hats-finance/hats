import { IVaultDescription } from "types/types";
import axios from "axios"
import { getPath, setPath } from "./objectUtils";


function isBlob(uri: string) {
    return uri.startsWith("blob:")
}

async function pinFile(fileContents: any) {
    let data = new FormData()
    data.append("file", fileContents)


    const response = await axios
        .post(`${process.env.REACT_APP_API_URL}/pinfile`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'chain': 'rinkeby',
                'safeaddress': '0x50e074Fe043b926aaA2aDA51AD282eE76081C318',
                'address': '0x8F402318BB49776f5017d2FB12c90D0B0acAAaE8'
            }
        })

    console.log('uploaded file', response.data)

    return response.data.uri
}

async function pinJson(object: any) {
    const response = await axios
        .post(`${process.env.REACT_APP_API_URL}/pinjson`, object, {
            headers: {
                'Content-Type': 'application/json',
                'chain': 'rinkeby',
                'safeaddress': '0x50e074Fe043b926aaA2aDA51AD282eE76081C318',
                'address': '0x8F402318BB49776f5017d2FB12c90D0B0acAAaE8'
            }
        })
    return response.data.uri
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
            const pinnedUri = await pinFile(blob)
            setPath(vaultDescription, iconPath, pinnedUri)
        }
    }

    const uploadedFile = pinJson(vaultDescription)

}