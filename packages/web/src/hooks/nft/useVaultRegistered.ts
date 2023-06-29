import { HATVaultsNFT_abi, IVault } from "@hats-finance/shared";
import { NFTContractDataProxy } from "constants/constants";
import { BigNumber } from "ethers";
import { appChains } from "settings";
import { useContractRead } from "wagmi";

export function useVaultRegisteredNft(vault: IVault) {
  const nftContract = {
    address: appChains[vault.chainId!].vaultsNFTContract! as `0x${string}`,
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
