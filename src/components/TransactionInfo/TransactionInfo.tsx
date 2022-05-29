import { useTransactions } from "@usedapp/core";
import { useSelector } from "react-redux";
import { Chains, ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import { CHAINID } from "../../settings";
import "./TransactionInfo.scss";

export default function TransactionInfo() {
  const chain = Chains[CHAINID];
  const currentTransaction = useTransactions().transactions.find(tx => !tx.receipt);
  const transactionHash = currentTransaction?.transaction?.hash
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  return (
    <div onClick={() => window.open(chain?.getExplorerTransactionLink(transactionHash!))} className="pending-transaction-wrapper">
      {screenSize === ScreenSize.Desktop ? "Pending Transaction" : "Pending"}
    </div>
  )
}
