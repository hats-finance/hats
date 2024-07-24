import { HATTokenLock_abi } from "@hats.finance/shared";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";

export class AcceptTokenLockContract {
  /**
   * Returns a caller function to accept tokenLock contract.
   *
   * @param tokenLock - The selected tokenLock contract to accept
   */
  static hook = (tokenLock: string | undefined, chainId: number | undefined) => {
    const { address: account } = useAccount();
    const { chain: connectedChain } = useNetwork();

    const acceptTokenLock = useContractWrite({
      mode: "recklesslyUnprepared",
      address: tokenLock as `0x${string}` | undefined,
      abi: HATTokenLock_abi,
      functionName: "acceptLock",
      chainId,
    });

    return {
      ...acceptTokenLock,
      send: async () => {
        try {
          if (!account || !connectedChain || !tokenLock || !chainId) return;
          await switchNetworkAndValidate(connectedChain.id, chainId);

          return acceptTokenLock.write();
        } catch (error) {
          console.log(error);
        }
      },
    };
  };
}
