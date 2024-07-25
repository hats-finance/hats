import { HATTokenLock_abi } from "@hats.finance/shared";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";

export class ReleaseTokenLockContract {
  /**
   * Returns a caller function to release tokens from tokenLock contract.
   *
   * @param tokenLock - The selected tokenLock contract to release tokens
   */
  static hook = (tokenLock: string | undefined, chainId: number | undefined) => {
    const { address: account } = useAccount();
    const { chain: connectedChain } = useNetwork();

    const releaseTokenLock = useContractWrite({
      mode: "recklesslyUnprepared",
      address: tokenLock as `0x${string}` | undefined,
      abi: HATTokenLock_abi,
      functionName: "release",
      chainId,
    });

    return {
      ...releaseTokenLock,
      send: async () => {
        try {
          if (!account || !connectedChain || !tokenLock || !chainId) return;
          await switchNetworkAndValidate(connectedChain.id, chainId);

          return releaseTokenLock.write();
        } catch (error) {
          console.log(error);
        }
      },
    };
  };
}
