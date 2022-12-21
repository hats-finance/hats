import { useEffect, useState } from "react";
import { getAirdropMerkleTree } from "./getAirdropMerkleTree";
import { getAirdropTokens } from "./getAirdropTokens";
import { getNftContract } from "./getNftContract";
import { getRedeemedState } from "./getRedeemedState";
import { AirdropMachineWallet, IAirdropData, INFTTokenInfoRedeemed } from "./types";

export function useAirdropData(address: string | undefined, chainId: number): IAirdropData {
  const [airdropTokens, setAirdropTokens] = useState<INFTTokenInfoRedeemed[] | undefined>();
  const [airdropInfo, setAirdropInfo] = useState<AirdropMachineWallet | undefined>();

  useEffect(() => {
    if (!address) return;
    const refresh = async () => {
      const nftContract = await getNftContract(chainId);
      if (!nftContract) return;
      const airdropTree = await getAirdropMerkleTree(nftContract);
      const addressInfo = airdropTree?.find((wallet) => wallet.address.toLowerCase() === address.toLowerCase());
      setAirdropInfo(addressInfo);
      if (!addressInfo) return;
      const airdropTokens = await getAirdropTokens(chainId, addressInfo, nftContract);
      const withRedeemed = await getRedeemedState(address, chainId, nftContract, airdropTokens);
      setAirdropTokens(withRedeemed);
    };
    refresh();
  }, [address, chainId]);

  return {
    airdropTokens,
    airdropInfo,
    isBeforeDeadline: false,
  };
}
