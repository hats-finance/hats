import { HATToken_abi } from "@hats.finance/shared";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useContractWrite, useNetwork } from "wagmi";

export class DelegateHATTokensContract {
  /**
   * Returns a caller function to delegate HAT tokens to a specific address
   */
  static hook = (token: string | undefined, chainId: number | undefined) => {
    const { chain } = useNetwork();

    const delegateHAT = useContractWrite({
      mode: "recklesslyUnprepared",
      address: token as `0x${string}` | undefined,
      abi: HATToken_abi,
      functionName: "delegate",
      chainId,
    });

    return {
      ...delegateHAT,
      send: async (delegate: string | undefined) => {
        if (!token || !chainId || !delegate) return;

        await switchNetworkAndValidate(chain!.id, chainId);

        // [params]: token, account
        return delegateHAT.write!({
          recklesslySetUnpreparedArgs: [delegate as `0x${string}`],
        });
      },
    };
  };
}
