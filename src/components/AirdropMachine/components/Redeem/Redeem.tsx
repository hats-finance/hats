import Loading from "components/Shared/Loading";
import { useTokenActions } from "hooks/tokenContractHooks";
import Eligible from "./components/Eligible/Eligible";
import NotEligible from "./components/NotEligible/NotEligible";
import "./index.scss";

interface IProps {
  address: string;
  closeRedeemModal: () => void;
}

export default function Redeem({ address, closeRedeemModal }: IProps) {
  const { extendedEligibility, addressEligibility } = useTokenActions(address);

  if (extendedEligibility && addressEligibility) {
    const redeemable = extendedEligibility.some(nft => !nft.isRedeemed);
    if (redeemable) {
      return <Eligible data={addressEligibility} closeRedeemModal={closeRedeemModal} />;
    } else return <span>ALREADY REDEEMED</span>;
  } else {
    return <NotEligible closeRedeemModal={closeRedeemModal} />;
  }
}
