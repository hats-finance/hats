import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { RoutePaths } from "navigation";
import { IPoolWithdrawRequest, IVault } from "types";
import { useSupportedNetwork } from "hooks/wagmi/useSupportedNetwork";
import { WithdrawTimer } from "pages/HoneypotsPage/DepositWithdraw";
import "./VaultActions.scss";
import WarnIcon from "@mui/icons-material/WarningAmberRounded";
import { IPFS_PREFIX } from "constants/constants";

interface IProps {
  data?: IVault;
  withdrawRequests?: IPoolWithdrawRequest[];
  preview?: boolean;
}

export default function VaultActions(props: IProps) {
  const navigate = useNavigate();
  const isSupportedNetwork = useSupportedNetwork();
  const { t } = useTranslation();
  const { address: account } = useAccount();
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
        onClick={() => navigate(`${RoutePaths.vaults}/${vault.id}/deposit`)}
        disabled={props.preview || !account || !isSupportedNetwork}
      >
        {t("Vault.deposit-withdraw")}
      </button>
      {!vault.multipleVaults && !props.preview && !vault.activeClaim && <WithdrawTimer vault={vault} showWithdrawState={false} />}
    </div>
  );
}
