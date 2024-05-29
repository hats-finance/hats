import { HATAirdrop_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { DropData } from "../types";
import { AirdropElegibility } from "../utils/getAirdropElegibility";
import { getAirdropMerkelTree, hashToken } from "../utils/getAirdropMerkelTree";

export class RedeemAirdropContract {
  /**
   * Returns a caller function to redeem airdrop.
   *
   * @param vault - The selected vault to deposit staking token
   */
  static hook = (airdrop: DropData, airdropElegibility: AirdropElegibility | false | undefined) => {
    const { address: account } = useAccount();
    const { chain: connectedChain } = useNetwork();

    const airdropContractAddress = airdrop.address;
    const airdropChainId = airdrop.chainId;

    const redeemAirdrop = useContractWrite({
      mode: "recklesslyUnprepared",
      address: airdropContractAddress as `0x${string}`,
      abi: HATAirdrop_abi,
      functionName: "redeem",
    });

    return {
      ...redeemAirdrop,
      send: async () => {
        try {
          if (!airdropElegibility) return;
          if (!account || !connectedChain) return;
          await switchNetworkAndValidate(connectedChain.id, airdropChainId);

          const merkelTree = await getAirdropMerkelTree(airdrop.descriptionData.merkeltree);
          const proof = merkelTree.getHexProof(hashToken(account, BigNumber.from(airdropElegibility.total))) as `0x${string}`[];

          return redeemAirdrop.write({
            recklesslySetUnpreparedArgs: [account, BigNumber.from(airdropElegibility.total), proof],
          });
        } catch (error) {
          console.log(error);
        }
      },
    };
  };
}
