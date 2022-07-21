import { useEthers } from "@usedapp/core";
import { useGetTierFromShares } from "hooks/airdropContractHooks";

interface IProps {
  pid: string;
}

export default function NFTElement({ pid }: IProps) {
  const { account } = useEthers();
  const res = useGetTierFromShares(pid, account!);
  console.log(res);

  return (
    <div>
      {res ? "ELIGIBELE" : null}
    </div>
  )
}