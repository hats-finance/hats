import { formatUnits, parseUnits } from "@ethersproject/units";
import { HATAirdropFactory_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { AirdropData } from "../types";
import { AirdropElegibility } from "../utils/getAirdropElegibility";
import { getAirdropMerkelTree, hashToken } from "../utils/getAirdropMerkelTree";

export class RedeemMultipleAirdropsContract {
  /**
   * Returns a caller function to redeem airdrop.
   *
   * @param vault - The selected vault to deposit staking token
   */
  static hook = (
    airdrops: AirdropData[],
    airdropsElegibility: (AirdropElegibility | false | undefined)[],
    factory: string,
    chainId: number
  ) => {
    const { address: account } = useAccount();
    const { chain: connectedChain } = useNetwork();

    const redeemAirdrops = useContractWrite({
      mode: "recklesslyUnprepared",
      address: factory as `0x${string}`,
      abi: HATAirdropFactory_abi,
      functionName: "redeemMultipleAirdrops",
    });

    return {
      ...redeemAirdrops,
      send: async (percentageToDeposit: number | undefined, vaultToDeposit: string | undefined) => {
        try {
          if (airdropsElegibility.some((elegibility) => !elegibility)) return;
          if (!account || !connectedChain) return;
          await switchNetworkAndValidate(connectedChain.id, chainId);

          const addresses = airdrops.map((airdrop) => airdrop.address as `0x${string}`);
          const amounts = airdropsElegibility.map((elegibility) =>
            !!elegibility ? BigNumber.from(elegibility.total) : BigNumber.from(0)
          );
          const proofsPromises = airdropsElegibility.map(async (elegibility, index) => {
            const merkelTree = await getAirdropMerkelTree(airdrops[index].descriptionData.merkeltree);
            const amount = !!elegibility ? BigNumber.from(elegibility.total) : BigNumber.from(0);
            const proof = merkelTree.getHexProof(hashToken(account, amount)) as `0x${string}`[];
            return proof;
          });
          const proofs = await Promise.all(proofsPromises);
          const vaults = airdrops.map((_) => (vaultToDeposit ?? 0x0000000000000000000000000000000000000000) as `0x${string}`);
          const deposits = airdropsElegibility.map((elegibility) => {
            if (!elegibility) return BigNumber.from(0);
            const total = +formatUnits(elegibility.total, 18);
            const toDeposit = percentageToDeposit ? percentageToDeposit * total : 0;
            return parseUnits(toDeposit.toString(), 18);
          });
          const minShares = airdrops.map((_) => BigNumber.from(0));

          return redeemAirdrops.write({
            recklesslySetUnpreparedArgs: [addresses, amounts, proofs, vaults, deposits, minShares],
          });
        } catch (error) {
          console.log(error);
        }
      },
    };
  };
}
