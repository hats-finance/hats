import { useContractFunction, useEthers } from "@usedapp/core";
import { Contract } from "ethers";
import vaultAbi from "data/abis/HATSVault.json";
import { useVaults } from "hooks/useVaults";
import { FormEventHandler, SyntheticEvent, useState } from "react";



export default function CreateVault({ descriptionHash }) {
    const { account } = useEthers();
    const { vaults, masters } = useVaults()
    const governedMasters = masters?.filter(master => master.governance.toLowerCase() === account?.toLowerCase())
    const vault = vaults?.find(vault => vault.descriptionHash === descriptionHash);
    const [master, setMaster] = useState(masters?.[0]); // for now just use first contract as default
    const [levelCount, setLevelCount] = useState<number>()

    const { send: sendAddPool, state: addPoolState } = useContractFunction(
        master?.address ? new Contract(master.address, vaultAbi) : undefined, "addPool", { transactionName: "Add Pool" });

    if (vault || !governedMasters) return <></>;


    const handleAddPool: FormEventHandler<HTMLFormElement> = (e: SyntheticEvent) => {
        e.preventDefault();
        console.log(e.target);
        sendAddPool()
    }

    if (["Mining", "PendingSignature"].includes(addPoolState.status)) {
        return <></>;
    }

    return <div>
        <input onSelect={(e: React.ChangeEvent<HTMLSelectElement>) => setMaster(e)} type="option">
            {masters?.map(master =>
                <option value={master.address}>{master.address}</option>)}
        </input>
        <form onSubmit={handleAddPool}>
            <input name="_allocPoint"></input>
            <input name="_lpToken"></input>
            <input name="_committee"></input>
            <input name="_rewardsLevels"></input>
            {Array(levelCount).map((level, i) =>
                <input name={`_rewardsLevels[${i}]`}></input>)}
            < button type="submit" >add pool</button>
        </form>
    </div >

}