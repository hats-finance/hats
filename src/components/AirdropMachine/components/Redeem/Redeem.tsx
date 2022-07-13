import { checkEligibility } from "components/AirdropMachine/utils";
import Loading from "components/Shared/Loading";
import { useEffect, useState } from "react";
import { AirdropMachineWallet } from "types/types";
import Eligible from "./components/Eligible/Eligible";
import "./index.scss";

interface IProps {
  address: string;
}

enum EligibilityStatus {
  ELIGIBLE,
  NOT_ELIGIBLE,
  REDEEMED,
  PENDING,
}

export default function Redeem({ address }: IProps) {
  const [eligibilityStatus, setEligibilityStatus] = useState(EligibilityStatus.PENDING);
  const [data, setData] = useState<AirdropMachineWallet>();

  useEffect(() => {
    (async () => {
      const data = await checkEligibility(address);
      setEligibilityStatus(data ? EligibilityStatus.ELIGIBLE : EligibilityStatus.NOT_ELIGIBLE);
      setData(data as any);
    })();
  }, [address, setEligibilityStatus, setData])

  const renderContent = (eligibilityStatus: EligibilityStatus) => {
    switch (eligibilityStatus) {
      case EligibilityStatus.ELIGIBLE:
        return <Eligible data={data!} />;
      case EligibilityStatus.NOT_ELIGIBLE:
        return <span>NOT ELIGIBLE</span>;
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
