import { useState } from "react";
import "./index.scss";

interface IProps {
  address: string;
}

enum EligibilityStatus {
  ELIGIBLE,
  NOT_ELIGIBLE,
  REDEEMED,
}

export default function Eligibility({ address }: IProps) {
  const [eligibilityStatus, setEligibilityStatus] = useState(EligibilityStatus.ELIGIBLE);

  const renderContent = (eligibilityStatus: EligibilityStatus) => {
    switch (eligibilityStatus) {
      case EligibilityStatus.ELIGIBLE:
        return <span>ELIGIBLE</span>;
      case EligibilityStatus.NOT_ELIGIBLE:
        return <span>NOT ELIGIBLE</span>;
      case EligibilityStatus.REDEEMED:
        return <span>REDEEMED</span>;
    }

  }

  return (
    <div>
      {address}
      {renderContent(eligibilityStatus)}
    </div>
  )
}
