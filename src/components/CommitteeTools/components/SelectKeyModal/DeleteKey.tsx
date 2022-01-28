import { useContext } from "react";
import { IStoredKey } from "../../../../types/types";
import { VaultContext } from "../../store";

function DeleteKey({ keyToDelete, onCompleted }: {
    keyToDelete: IStoredKey
    onCompleted: () => any
}) {
    const vaultContext = useContext(VaultContext);

    return (<div>
        <h1>are you sure?</h1>
        <button onClick={() => {
            vaultContext!.deleteKey!(keyToDelete)
            onCompleted()
        }}>Yes</button>
        <button onClick={() => {
            onCompleted()
        }}>Cancel</button>

    </div>)
}

export default DeleteKey