import { Loading } from "components";
import { useContext } from "react";
import { AirdropMachineContext } from "../CheckEligibility/CheckEligibility";
import Eligible from "./Eligible/Eligible";
import NotEligible from "./NotEligible/NotEligible";
import Redeemed from "./Redeemed/Redeemed";

export default function Redeem() {
  const { nftData } = useContext(AirdropMachineContext);

  if (nftData.merkleTree) {
    if (nftData.treeTokens) {
      if (nftData.treeRedeemablesCount === 0 && (nftData.treeTokens?.length ?? 0) > 0) {
        return <Redeemed />;
      }
      if (nftData.treeTokens.length === 0 || nftData.treeRedeemablesCount > 0) {
        return <Eligible />;
      }
    }
    if (!nftData.addressInfo) {
      return <NotEligible />;
    }
  }

  return <Loading />;
}

