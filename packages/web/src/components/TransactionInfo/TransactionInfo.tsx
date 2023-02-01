import "./TransactionInfo.scss";

export function TransactionInfo() {
  // TODO: [v2] re-implement this functionality (show ongoing transaction)
  return <></>;
  // const currentTransaction = useTransactions().transactions.find((tx) => !tx.receipt);
  // const transactionHash = currentTransaction?.transaction?.hash;
  // const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  // // TODO:[v2] onClick should open blockExplorer
  // return (
  //   <div className="pending-transaction-wrapper">{screenSize === ScreenSize.Desktop ? "Pending Transaction" : "Pending"}</div>
  // );
}
