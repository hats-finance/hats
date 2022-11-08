import { useTransactions } from "@usedapp/core";
import { useSelector } from "react-redux";
import { ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import { CHAINID, CHAINS } from "../../settings";
import "./TransactionInfo.scss";

export function TransactionInfo() {
  const chain = CHAINS[CHAINID].chain;
  const currentTransaction = useTransactions().transactions.find(tx => !tx.receipt);
  const transactionHash = currentTransaction?.transaction?.hash
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  return (
    <div onClick={() => window.open(chain?.getExplorerTransactionLink(transactionHash!))} className="pending-transaction-wrapper">
      {screenSize === ScreenSize.Desktop ? "Pending Transaction" : "Pending"}
    </div>
  )
}
