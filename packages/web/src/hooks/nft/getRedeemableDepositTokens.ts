import { readContract, readContracts } from "wagmi/actions";
import { HATVaultsNFT_abi } from "@hats-finance/shared";
import { NFTContractDataProxy } from "constants/constants";
import { BigNumber } from "ethers";
import { IVault } from "types";
import { appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { INFTToken, INFTTokenInfoRedeemed, INFTTokenMetadata, IVaultIdentifier } from "./types";

export async function getDepositTokensWithRedeemState(
  vault: IVault,
  tiers: number,
  address: string
): Promise<INFTTokenInfoRedeemed[]> {
  const nftContract = {
    address: appChains[vault.chainId!].vaultsNFTContract!,
    abi: HATVaultsNFT_abi as any,
    chainId: vault.chainId!,
  };

  const vaultIdentifier: IVaultIdentifier = {
    pid: vault.pid,
    masterAddress: vault.master.address,
    proxyAddress: NFTContractDataProxy[vault.master.address.toLowerCase()],
    chainId: vault.chainId!,
  };
  const tokens: INFTToken[] =
    tiers > 0
      ? Array.from({ length: tiers }, (_, i) => i + 1).map((tier) => ({
          ...vaultIdentifier,
          tier,
        }))
      : [];

  const tokensIds = (await readContracts({
    contracts: tokens.map(
      ({ proxyAddress, pid, tier }) =>
        ({
          ...nftContract,
          functionName: "getTokenId",
          args: [proxyAddress, Number(pid), tier],
        } as any)
    ),
  })) as BigNumber[];

  const tokensUris = (await readContracts({
    contracts: tokensIds.map(
      (id) =>
        ({
          ...nftContract,
          functionName: "uri",
          args: [id],
        } as any)
    ),
  })) as string[];

  const tokensMetadata = await Promise.all(
    tokensUris.map(async (tokenUri) => {
      const res = await fetch(ipfsTransformUri(tokenUri));
      return (await res.json()) as INFTTokenMetadata;
    })
  );
  const tokensBalances = (await readContract({
    ...nftContract,
    functionName: "balanceOfBatch",
    args: [tokensIds.map(() => address), tokensIds.map((id) => id)],
  } as any)) as BigNumber[];

  return tokens.map((token, i) => ({
    ...token,
    tokenId: tokensIds[i],
    uri: tokensUris[i],
    metadata: tokensMetadata[i],
    isRedeemed: !tokensBalances[i].isZero(),
  }));
}
