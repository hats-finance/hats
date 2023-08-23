export const isValidIpfsHash = (value: string | undefined): boolean => {
  const ipfsRegex = new RegExp(/Qm[1-9A-HJ-NP-Za-km-z]{44}/g);
  return value ? ipfsRegex.test(value) : false;
};

export const ipfsTransformUri = (ipfsUrl: string, uri: string | undefined) => {
  if (!uri || typeof uri !== "string") return "";

  if (uri.startsWith("ipfs")) {
    let ipfs;
    if (uri.startsWith("ipfs://ipfs/")) {
      ipfs = uri.slice(12);
    } else if (uri.startsWith("ipfs:///ipfs/")) {
      ipfs = uri.slice(13);
    } else if (uri.startsWith("ipfs/")) {
      ipfs = uri.slice(5);
    } else if (uri.startsWith("ipfs://")) {
      ipfs = uri.slice(7);
    }
    return `${ipfsUrl}/${ipfs}`;
  } else if (uri.startsWith("http")) {
    return uri;
  } else if (uri.startsWith("blob")) {
    return uri;
  }
  return `${ipfsUrl}/${uri}`;
};
