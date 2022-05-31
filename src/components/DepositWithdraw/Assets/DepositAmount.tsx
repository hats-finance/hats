import { useQuery } from "@apollo/client";
import { useEthers } from "@usedapp/core";
import { getStakerDeposit } from "graphql/subgraph";
import { POLL_INTERVAL } from "settings";

interface IProps {
  vaultId: string;
}

export const DepositAmount = ({ vaultId }: IProps) => {
  const { account } = useEthers();
  const { loading, data } = useQuery(getStakerDeposit(vaultId, account!), { pollInterval: POLL_INTERVAL });

  return (
    <span>{loading ? "-" : data?.stakers[0].depositAmount}</span>
  )
}
