import { useEthers } from "@usedapp/core";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";
import WithdrawTimer from "components/DepositWithdraw/WithdrawTimer/WithdrawTimer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IPoolWithdrawRequest, IVault } from "../../types/types";
import "./VaultAction.scss";
import { RoutePaths } from "navigation";

interface IProps {
  data?: IVault
  withdrawRequests?: IPoolWithdrawRequest[]
  preview?: boolean
}

export default function VaultAction(props: IProps) {
  const navigate = useNavigate();
  const isSupportedNetwork = useSupportedNetwork();
  const { t } = useTranslation();
  const { account } = useEthers();

  return (
    <div className="vault-action-wrapper">
      <button
        className="deposit-withdraw"
        onClick={() => {
          navigate(`${RoutePaths.vaults}/${props.data?.pid}/deposit`)
        }}
        disabled={props.preview || !account || !isSupportedNetwork}>
        {t("Vault.deposit-withdraw")}
      </button>
      {!props.data?.multipleVaults && !props.preview && <WithdrawTimer vault={props.data!} showWithdrawState={false} />}
    </div >
  )
}
