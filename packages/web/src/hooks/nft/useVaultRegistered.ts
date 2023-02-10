import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { HATVaultsNFT_abi } from "@hats-finance/shared";
import { IVault } from "types";
import { ChainsConfig } from "config/chains";
import { NFTContractDataProxy } from "constants/constants";

export function useVaultRegisteredNft(vault: IVault) {
  const nftContract = {
    address: ChainsConfig[vault.chainId!].vaultsNFTContract!,
    abi: HATVaultsNFT_abi,
    chainId: vault.chainId!,
    scopeKey: "hats",
    watch: false,
  };

  const nftContractDataProxyAddress = NFTContractDataProxy[vault.master.address] ?? "0x0000000000000000000000000000000000000000";

  const { data: vaultId } = useContractRead({
    ...nftContract,
    functionName: "getVaultId",
    args: [nftContractDataProxyAddress as `0x${string}`, BigNumber.from(vault.pid)],
  });

  const { data: vaultRegistered } = useContractRead({
    ...nftContract,
    functionName: "vaultsRegistered",
    args: [vaultId as `0x${string}`],
    enabled: !!vaultId,
  });

  return vaultRegistered as boolean | undefined;
}
