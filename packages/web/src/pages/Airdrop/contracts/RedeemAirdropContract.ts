import { AirdropChainConfig, HATAirdrop_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { IS_PROD } from "settings";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { AirdropElegibility } from "../utils/getAirdropElegibility";
import { getAirdropMerkelTree, hashToken } from "../utils/getAirdropMerkelTree";
import { getAirdropMerkleTreeJSON } from "../utils/getAirdropMerkelTreeJSON";

export class RedeemAirdropContract {
  /**
   * Returns a caller function to redeem airdrop.
   *
   * @param vault - The selected vault to deposit staking token
   */
  static hook = (airdropElegibility: AirdropElegibility | false | undefined) => {
    const { address: account } = useAccount();
    const { chain: connectedChain } = useNetwork();

    const isTestnet = !IS_PROD && connectedChain?.testnet;
    const env = isTestnet ? "test" : "prod";
    const aidropChainConfig = AirdropChainConfig[env];
    const airdropContractAddress = aidropChainConfig.address;
    const airdropChainId = aidropChainConfig.chain.id;

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

          const merkelTreeData = await getAirdropMerkleTreeJSON({
            address: aidropChainConfig.address,
            chainId: aidropChainConfig.chain.id,
          });
          const merkelTree = await getAirdropMerkelTree(merkelTreeData);

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
