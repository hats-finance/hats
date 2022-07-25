//import Loading from "components/Shared/Loading";
import { useContext } from "react";
import { AirdropMachineContext } from "../CheckEligibility/CheckEligibility";
import Eligible from "./components/Eligible/Eligible";
import NotEligible from "./components/NotEligible/NotEligible";
import "./index.scss";

export default function Redeem() {
  const { nftData: { redeemable } } = useContext(AirdropMachineContext);

  if (redeemable) {
    if (redeemable.length > 0) {
      return <Eligible />;
    } else
      return <span>ALREADY REDEEMED</span>;
  } else {
    return <NotEligible />;
  }
}
