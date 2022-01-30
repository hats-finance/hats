import { useContext } from "react";
import { IStoredKey } from "../../../../types/types";
import { VaultContext } from "../../store";

function DeleteKey({ keyToDelete, onFinish }: {
    keyToDelete: IStoredKey
    onFinish: () => any
}) {
    const vaultContext = useContext(VaultContext);

    return (<div>
        <h1>are you sure?</h1>
        <button onClick={() => {
            vaultContext!.deleteKey!(keyToDelete)
            onFinish()
        }}>Yes</button>
        <button onClick={() => {
            onFinish()
        }}>Cancel</button>

    </div>)
}

export default DeleteKey