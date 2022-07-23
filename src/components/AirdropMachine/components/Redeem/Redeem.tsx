import { getEligibilityData } from "components/AirdropMachine/utils";
import Loading from "components/Shared/Loading";
import { useTokenActions } from "hooks/tokenContractHooks";
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
  const { isTokenRedeemed } = useTokenActions();
  const [data, setData] = useState<AirdropMachineWallet>();

  useEffect(() => {
    (async () => {
      const data = await getEligibilityData(address);
      if (data) {
        const nonRedeemedNFTs = data.nft_elegebility.filter(async (nft) => !(await isTokenRedeemed(nft.pid, nft.tier, data.id)));
        const filteredData = data;
        filteredData.nft_elegebility = nonRedeemedNFTs;
        if (nonRedeemedNFTs.length > 0) {
          setEligibilityStatus(EligibilityStatus.ELIGIBLE);
          setData(filteredData);
        } else {
          setEligibilityStatus(EligibilityStatus.REDEEMED);
        }
      } else {
        setEligibilityStatus(EligibilityStatus.NOT_ELIGIBLE);
      }
    })();
  }, [address, setEligibilityStatus, setData])

  const renderContent = (eligibilityStatus: EligibilityStatus) => {
    switch (eligibilityStatus) {
      case EligibilityStatus.ELIGIBLE:
        return <Eligible data={data!} closeRedeemModal={closeRedeemModal} />;
      case EligibilityStatus.NOT_ELIGIBLE:
        return <NotEligible closeRedeemModal={closeRedeemModal} />;
      case EligibilityStatus.REDEEMED:
        return <span>ALREADY REDEEMED</span>;
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
