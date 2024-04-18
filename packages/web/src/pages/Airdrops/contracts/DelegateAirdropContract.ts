import { AirdropConfig, HATTokenLock_abi, HATToken_abi } from "@hats.finance/shared";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { getAccount, getNetwork, prepareWriteContract, writeContract } from "wagmi/actions";
import { AirdropRedeemData } from "../utils/getAirdropRedeemedData";

export class DelegateAirdropContract {
  /**
   * Returns a caller function to redeem airdrop.
   *
   * @param vault - The selected vault to deposit staking token
   */
  static send = async (airdrop: AirdropConfig, redeemData: AirdropRedeemData | undefined, delegatee: string) => {
    if (!redeemData) return;

    const { address: account } = getAccount();
    const { chain: connectedChain } = getNetwork();
    if (!account || !connectedChain) return;

    const airdropChainId = airdrop.chain.id;
    await switchNetworkAndValidate(connectedChain.id, airdropChainId);

    const config = await prepareWriteContract({
      address: redeemData.tokenLock ? redeemData.tokenLock.address : redeemData.token,
      abi: (redeemData ? (redeemData.tokenLock ? HATTokenLock_abi : HATToken_abi) : undefined) as any,
      functionName: "delegate",
      args: [delegatee],
    });

    return writeContract(config);
  };
}
