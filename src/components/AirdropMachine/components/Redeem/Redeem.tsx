import { useContext } from "react";
import { AirdropMachineContext } from "../CheckEligibility/CheckEligibility";
import Eligible from "./components/Eligible/Eligible";
import NotEligible from "./components/NotEligible/NotEligible";
import "./index.scss";

export default function Redeem() {
  const { nftData } = useContext(AirdropMachineContext);

  /** TODO: need to show a loader until the data is fetched */
  if (nftData?.actualAddressInfo) {
    if (nftData.airdropToRedeem) {
      return <Eligible />
    } else return (
      <div className="already-redeemed-wrapper">
        Already Redeemed!
      </div>
    )
  } else return <NotEligible />;
}
