import { HATAirdropFactory_abi } from "@hats.finance/shared";
import { getAirdropMerkelTree, hashToken } from "pages/Airdrops/utils/getAirdropMerkelTree";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { DropDataConvertible } from "../types";

export class RedeemPointdropsContract {
  /**
   * Returns a caller function to redeem multiple pointdrops at once.
   *
   * @param vault - The selected vault to deposit staking token
   */
  static hook = (pointdrops: DropDataConvertible[]) => {
    const { address: account } = useAccount();
    const { chain: connectedChain } = useNetwork();

    const factoryAddress = pointdrops[0]?.factory;
    const chainId = pointdrops[0]?.chainId;

    const redeemPointdrops = useContractWrite({
      mode: "recklesslyUnprepared",
      address: factoryAddress as `0x${string}`,
      abi: HATAirdropFactory_abi,
      functionName: "redeemMultipleAirdrops",
    });

    // TODO: Fix this
    return {
      ...redeemPointdrops,
      send: async () => {},
      // send: async () => {
      //   try {
      //     if (!account || !connectedChain) return;
      //     await switchNetworkAndValidate(connectedChain.id, chainId);

      //     const pointdropsAddresses = pointdrops.map((pointdrop) => pointdrop.address as `0x${string}`);
      //     const pointdropsAmounts = pointdrops.map((pointdrop) => pointdrop.tokens);
      //     const pointdropsProofs = await Promise.all(
      //       pointdrops.map(async (pointdrop) => {
      //         const merkelTree = await getAirdropMerkelTree(pointdrop.descriptionData.merkeltree);
      //         return merkelTree.getHexProof(hashToken(account, pointdrop.tokens)) as `0x${string}`[];
      //       })
      //     );

      //     return redeemPointdrops.write({
      //       recklesslySetUnpreparedArgs: [pointdropsAddresses, pointdropsAmounts, pointdropsProofs],
      //     });
      //   } catch (error) {
      //     console.log(error);
      //   }
      // },
    };
  };
}
