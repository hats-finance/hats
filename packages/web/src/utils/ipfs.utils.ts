export const isValidIpfsHash = (value: string | undefined): boolean => {
  const ipfsRegex = new RegExp(/Qm[1-9A-HJ-NP-Za-km-z]{44}/g);
  return value ? ipfsRegex.test(value) : false;
};
