import WarnIcon from "@mui/icons-material/WarningAmberRounded";
import { IPFS_PREFIX } from "constants/constants";
import { useSupportedNetwork } from "hooks/wagmi/useSupportedNetwork";
import { WithdrawTimer } from "pages/HoneypotsPage/DepositWithdraw";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IPoolWithdrawRequest, IVault } from "types";
import { useAccount } from "wagmi";
import "./VaultActions.scss";

interface IProps {
  data?: IVault;
  withdrawRequests?: IPoolWithdrawRequest[];
  preview?: boolean;
}

export default function VaultActions(props: IProps) {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const navigate = useNavigate();
  const isSupportedNetwork = useSupportedNetwork();
  const vault = props.data;

  if (!vault) return null;
  return (
    <div className="vault-action-wrapper">
      {vault.activeClaim && (
        <span className="active-claim" onClick={() => window.open(`${IPFS_PREFIX}/${vault.activeClaim?.claim}`, "_blank")}>
          <WarnIcon className="icon" />
          {t("pendingReward")}
        </span>
      )}
      <button
        className="deposit-withdraw"
        onClick={() => navigate(`${vault.id}/deposit`)}
        disabled={props.preview || !account || !isSupportedNetwork}
      >
        {t("Vault.deposit-withdraw")}
      </button>
      {!vault.multipleVaults && !props.preview && !vault.activeClaim && <WithdrawTimer vault={vault} showWithdrawState={false} />}
    </div>
  );
}
