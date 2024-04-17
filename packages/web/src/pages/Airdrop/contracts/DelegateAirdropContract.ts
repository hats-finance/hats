import { AirdropChainConfig, HATTokenLock_abi, HATToken_abi } from "@hats.finance/shared";
import { IS_PROD } from "settings";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { AirdropRedeemData } from "../utils/getAirdropRedeemedData";

export class DelegateAirdropContract {
  /**
   * Returns a caller function to redeem airdrop.
   *
   * @param vault - The selected vault to deposit staking token
   */
  static hook = (redeemData: AirdropRedeemData | undefined) => {
    const { address: account } = useAccount();
    const { chain: connectedChain } = useNetwork();

    const isTestnet = !IS_PROD && connectedChain?.testnet;
    const env = isTestnet ? "test" : "prod";
    const aidropChainConfig = AirdropChainConfig[env];
    const airdropChainId = aidropChainConfig.chain.id;

    // If the user has tokenLock we need to delegate the tokenLock. If not, we need to delegate the token.
    const delegateAirdrop = useContractWrite({
      mode: "recklesslyUnprepared",
      address: redeemData ? (redeemData.tokenLock ? redeemData.tokenLock.address : redeemData.token) : undefined,
      abi: (redeemData ? (redeemData.tokenLock ? HATTokenLock_abi : HATToken_abi) : undefined) as any,
      functionName: "delegate",
    });

    return {
      ...delegateAirdrop,
      send: async (delegatee: string) => {
        try {
          if (!redeemData) return;
          if (!account || !connectedChain) return;
          await switchNetworkAndValidate(connectedChain.id, airdropChainId);

          return delegateAirdrop.write({ recklesslySetUnpreparedArgs: [delegatee] });
        } catch (error) {
          console.log(error);
        }
      },
    };
  };
}
