import { switchNetwork } from "@wagmi/core";

export const switchNetworkAndValidate = async (currentChainId: number, desiredChainId: number): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (currentChainId !== desiredChainId) {
        await switchNetwork({ chainId: desiredChainId });
        resolve();
      } else {
        resolve();
      }
    } catch (error) {
      console.log(error);
      alert(`Please switch the network to ${desiredChainId} before proceeding.`);
      reject(error);
    }
  });
};
