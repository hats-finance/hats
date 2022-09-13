import Loading from "components/Shared/Loading";
import { useContext } from "react";
import { AirdropMachineContext } from "../CheckEligibility/CheckEligibility";
import Eligible from "./components/Eligible/Eligible";
import NotEligible from "./components/NotEligible/NotEligible";
import Redeemed from "./components/Redeemed/Redeemed";

export default function Redeem() {
  const { nftData } = useContext(AirdropMachineContext);

  if (nftData?.addressInfo) {
    if (!nftData.treeRedeemables) {
      return <Loading />;
    } else if (nftData.treeRedeemables?.length > 0) {
      return <Eligible />
    } else return <Redeemed />
  } else return <NotEligible />;
}
