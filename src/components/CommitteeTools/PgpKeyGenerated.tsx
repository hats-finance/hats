import { IStoredKey } from "../../types/types";
import CopyToClipboard from "../Shared/CopyToClipboard";

export default function PgpKeyGenerated({ key }: {
    key: IStoredKey
}) {
    return <div>
        {/* <p>Public Key<CopyToClipboard value={} /></p> */}
        <p>Private Key<CopyToClipboard value={key.privateKey} /></p>
    </div>
}