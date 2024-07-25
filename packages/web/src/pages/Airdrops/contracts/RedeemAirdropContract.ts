import { HATAirdrop_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { DropData } from "../types";
import { AirdropEligibility } from "../utils/getAirdropEligibility";
import { getAirdropMerkleTree, hashToken } from "../utils/getAirdropMerkleTree";

export class RedeemAirdropContract {
  /**
   * Returns a caller function to redeem airdrop.
   *
   * @param vault - The selected vault to deposit staking token
   */
  static hook = (airdrop: DropData, airdropEligibility: AirdropEligibility | false | undefined) => {
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
          if (!airdropEligibility) return;
          if (!account || !connectedChain) return;
          await switchNetworkAndValidate(connectedChain.id, airdropChainId);

          const merkleTree = await getAirdropMerkleTree(airdrop.descriptionData.merkletree);
          const proof = merkleTree.getHexProof(hashToken(account, BigNumber.from(airdropEligibility.total))) as `0x${string}`[];

          return redeemAirdrop.write({
            recklesslySetUnpreparedArgs: [account, BigNumber.from(airdropEligibility.total), proof],
          });
        } catch (error) {
          console.log(error);
        }
      },
    };
  };
}
