import Loading from "components/Shared/Loading";
import { useContext } from "react";
import { AirdropMachineContext } from "../CheckEligibility/CheckEligibility";
import Eligible from "./components/Eligible/Eligible";
import NotEligible from "./components/NotEligible/NotEligible";
import Redeemed from "./components/Redeemed/Redeemed";

export default function Redeem() {
  const { nftData } = useContext(AirdropMachineContext);

  console.log({ nftData });

  if (nftData.treeRedeemables?.length == 0
    && ((nftData.treeTokens?.length ?? 0) > 0))
    return <Redeemed />
  if (nftData?.addressInfo) {
    if (!nftData.treeRedeemables) {
      return <Loading />;
    } else if (nftData.treeRedeemables?.length > 0) {
      return <Eligible />
    } else {
      return <NotEligible />
    }
  }
  else return <NotEligible />;
}
