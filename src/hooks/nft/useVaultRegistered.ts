import { ChainsConfig } from "config/chains";
import { NFTContractDataProxy } from "constants/constants";
import { HATVaultsNFT_abi } from "data/abis/HATVaultsNFT_abi";
import { IVault } from "types";
import { useContractRead } from "wagmi";

export function useVaultRegisteredNft(vault: IVault) {
  const nftContract = {
    address: ChainsConfig[vault.chainId!].vaultsNFTContract!,
    abi: HATVaultsNFT_abi,
    chainId: vault.chainId!,
    scopeKey: "hats",
    watch: false,
  };
  const { data: vaultId } = useContractRead({
    ...nftContract,
    functionName: "getVaultId",
    args: [NFTContractDataProxy[vault.master.address], vault.pid],
  });

  const { data: vaultRegistered } = useContractRead({
    ...nftContract,
    functionName: "vaultsRegistered",
    args: [vaultId],
  });

  return vaultRegistered as boolean | undefined;
}
