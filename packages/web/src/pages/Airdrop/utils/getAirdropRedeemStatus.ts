import { AirdropChainConfig, HATAirdrop_abi } from "@hats.finance/shared";
import { getContract, getProvider } from "wagmi/actions";

export type AirdropRedeemStatus = "redeemed" | "redeemable";

export const getAirdropRedeemStatus = async (address: string, env: "test" | "prod"): Promise<AirdropRedeemStatus> => {
  const aidropChainConfig = AirdropChainConfig[env];
  const airdropContractAddress = aidropChainConfig.address;
  const chainId = aidropChainConfig.chain.id;

  const provider = getProvider({ chainId });
  if (!airdropContractAddress) {
    alert(`Airdrop contract not found on chain ${chainId}`);
    throw new Error("Airdrop contract not found");
  }

  const airdropContract = getContract({
    abi: HATAirdrop_abi,
    address: airdropContractAddress,
    signerOrProvider: provider,
  });

  const events = await airdropContract.queryFilter("TokensRedeemed", 0);
  const wasRedeemed = events.some(
    (event) => (event.args as { _account: string } | undefined)?._account.toLowerCase() === address.toLowerCase()
  );
  return wasRedeemed ? "redeemed" : "redeemable";
};
