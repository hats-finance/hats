import { Contract } from "ethers";
// import vaultAbi from "data/abis/HATSVault.json";
import { useVaults } from "hooks/vaults/useVaults";
import { FormEventHandler, SyntheticEvent, useState } from "react";
import { Transactions } from "constants/constants";
import { useAccount } from "wagmi";

export default function CreateVault({ descriptionHash }) {
  const { address: account } = useAccount();
  const { vaults, masters } = useVaults();
  const governedMasters = masters?.filter((master) => master.governance.toLowerCase() === account?.toLowerCase());
  const vault = vaults?.find((vault) => vault.descriptionHash === descriptionHash);
  const [masterAddress, setMasterAddress] = useState<string | undefined>(masters?.[0].address); // for now just use first contract as default
  const levelCount = 6;
  //const [levelCount, setLevelCount] = useState<number>()

  // const { send: sendAddPool, state: addPoolState } = useContractFunction(
  //   masterAddress ? new Contract(masterAddress, vaultAbi) : undefined, "addPool", { transactionName: Transactions.AddPool });

  if (vault || !governedMasters) return <></>;

  const handleAddPool: FormEventHandler<HTMLFormElement> = (e: SyntheticEvent) => {
    e.preventDefault();
    // sendAddPool()
  };

  // if (["Mining", "PendingSignature"].includes(addPoolState.status)) {
  //   return <></>;
  // }

  return (
    <>
      <input onSelect={(e) => setMasterAddress(e.currentTarget.value as string)} type="option">
        {masters?.map((master) => (
          <option value={master.address}>{master.address}</option>
        ))}
      </input>
      <form onSubmit={handleAddPool}>
        <input name="_allocPoint"></input>
        <input name="_lpToken"></input>
        <input name="_committee"></input>
        <input name="_rewardsLevels"></input>
        {Array(levelCount).map((level, i) => (
          <input name={`_rewardsLevels[${i}]`}></input>
        ))}
        <button type="submit">add pool</button>
      </form>
    </>
  );
}
