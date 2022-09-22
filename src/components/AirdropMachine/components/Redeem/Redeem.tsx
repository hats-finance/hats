import Loading from "components/Shared/Loading";
import { useContext } from "react";
import { AirdropMachineContext } from "../CheckEligibility/CheckEligibility";
import Eligible from "./components/Eligible/Eligible";
import NotEligible from "./components/NotEligible/NotEligible";
import Redeemed from "./components/Redeemed/Redeemed";

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

