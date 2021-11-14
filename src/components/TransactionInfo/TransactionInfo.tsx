
import { useSelector } from "react-redux";
import { ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import { NETWORK } from "../../settings";
import { linkToEtherscan } from "../../utils";
import "./TransactionInfo.scss";

export default function TransactionInfo() {
  const transactionHash = useSelector((state: RootState) => state.layoutReducer.transactionHash);
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  return (
    <div onClick={() => window.open(linkToEtherscan(transactionHash, NETWORK, true))} className="pending-transaction-wrapper">
      {screenSize === ScreenSize.Desktop ? "Pending Transaction" : "Pending"}
    </div>
  )
}
