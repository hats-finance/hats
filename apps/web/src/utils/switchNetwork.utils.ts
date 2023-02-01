import { switchNetwork } from "@wagmi/core";

export const switchNetworkAndValidate = async (currentChainId: number, desiredChainId: number): Promise<void> => {
  try {
    if (currentChainId !== desiredChainId) {
      await switchNetwork({ chainId: desiredChainId });
    }
  } catch (error) {
    console.log(error);
    alert(`Please switch the network to ${desiredChainId} before proceeding.`);
  }
};
