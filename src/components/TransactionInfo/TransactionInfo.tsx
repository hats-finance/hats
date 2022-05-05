import { getChainById } from "@usedapp/core/dist/esm/src/helpers";
import { useSelector } from "react-redux";
import { ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import { CHAINID } from "../../settings";
import "./TransactionInfo.scss";

export default function TransactionInfo() {
  const transactionHash = useSelector((state: RootState) => state.layoutReducer.transactionHash);
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const chain = getChainById(CHAINID);
  return (
    <div onClick={() => window.open(chain?.getExplorerTransactionLink(transactionHash))} className="pending-transaction-wrapper">
      {screenSize === ScreenSize.Desktop ? "Pending Transaction" : "Pending"}
    </div>
  )
}
