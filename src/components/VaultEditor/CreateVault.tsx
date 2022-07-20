import { useContractFunction, useEthers } from "@usedapp/core";
import { Contract } from "ethers";
import vaultAbi from "data/abis/HATSVault.json";
import { useVaults } from "hooks/useVaults";
import { FormEventHandler, useState } from "react";



export default function ({ descriptionHash }) {
    const { account } = useEthers();
    const isGovernance = account?.toLowerCase() === account?.toLowerCase()
    const { vaults, masters } = useVaults()
    const vault = vaults?.find(vault => vault.descriptionHash === descriptionHash);
    const master = masters?.[0]; // for now just use first contract as default
    console.log(vault);

    const [levelCount, setLevelCount] = useState<number>()
    if (vault || !master) return <></>;

    const { send: sendAddPool, state: addPoolState } = useContractFunction(
        new Contract(master.address, vaultAbi), "addPool", { transactionName: "Add Pool" });

    const handleAddPool: FormEventHandler = (e) => {
        sendAddPool()
    }

    if (!isGovernance) return <></>;
    return <div>
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