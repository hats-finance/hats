import { Loading } from "components";
import { useContext } from "react";
import { AirdropMachineContext } from "../context";
import Eligible from "./Eligible/Eligible";
import NotEligible from "./NotEligible/NotEligible";
import Redeemed from "./Redeemed/Redeemed";

export default function Redeem() {
  const { airdropData } = useContext(AirdropMachineContext);

  if (airdropData.airdropTokens !== undefined) {
    if ((airdropData.airdropTokens?.length ?? 0) > 0) {
      if (airdropData.airdropTokens?.every(t => t.isRedeemed)) {
        return <Redeemed />;
      } else {
        return <Eligible />;
      }
    } else {
      return <NotEligible />;
    }
  }
  return <Loading />;
}

