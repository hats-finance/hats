import { useTransactions } from "@usedapp/core";
import { useSelector } from "react-redux";
import { ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import "./TransactionInfo.scss";

export function TransactionInfo() {
  const currentTransaction = useTransactions().transactions.find((tx) => !tx.receipt);
  const transactionHash = currentTransaction?.transaction?.hash;
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  // TODO:[v2] onClick should open blockExplorer
  return (
    <div className="pending-transaction-wrapper">{screenSize === ScreenSize.Desktop ? "Pending Transaction" : "Pending"}</div>
  );
}
