import { getEligibilityData } from "components/AirdropMachine/utils";
import Loading from "components/Shared/Loading";
import { useEffect, useState } from "react";
import { AirdropMachineWallet } from "types/types";
import Eligible from "./components/Eligible/Eligible";
import NotEligible from "./components/NotEligible/NotEligible";
import "./index.scss";

interface IProps {
  address: string;
  closeRedeemModal: () => void;
}

enum EligibilityStatus {
  ELIGIBLE,
  NOT_ELIGIBLE,
  REDEEMED,
  PENDING,
}

export default function Redeem({ address, closeRedeemModal }: IProps) {
  const [eligibilityStatus, setEligibilityStatus] = useState(EligibilityStatus.PENDING);
  const [data, setData] = useState<AirdropMachineWallet>();

  useEffect(() => {
    (async () => {
      const data = await getEligibilityData(address);
      /**
       * TODO:
       * 1. getEligibilityData needs to indicate if it's already redeemed.
       * 2. check if deadline is in the future - maybe no need since we might just disable the
       *    input box if we are after the deadline.
       */
      setEligibilityStatus(data ? EligibilityStatus.ELIGIBLE : EligibilityStatus.NOT_ELIGIBLE);
      setData(data as any);
    })();
  }, [address, setEligibilityStatus, setData])

  const renderContent = (eligibilityStatus: EligibilityStatus) => {
    switch (eligibilityStatus) {
      case EligibilityStatus.ELIGIBLE:
        return <Eligible data={data!} closeRedeemModal={closeRedeemModal} />;
      case EligibilityStatus.NOT_ELIGIBLE:
        return <NotEligible closeRedeemModal={closeRedeemModal} />;
      case EligibilityStatus.REDEEMED:
        return <span>REDEEMED</span>;
      case EligibilityStatus.PENDING:
        return <Loading />;
    }
  }

  return (
    <>
      {renderContent(eligibilityStatus)}
    </>
  )
}
