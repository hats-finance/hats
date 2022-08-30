import { formatEther } from "@ethersproject/units";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { useVaults } from "hooks/useVaults";
import { useTranslation } from "react-i18next";
import WalletIcon from "assets/icons/balance.svg";
import "./index.scss";

export default function Balance() {
  const { t } = useTranslation();
  const { account } = useEthers();
  const { masters } = useVaults();
  const hatsBalance = formatEther(useTokenBalance(masters?.[0].rewardsToken, account) ?? 0);
  const hatsBalanceString = (+hatsBalance).toFixed(4);

  return (
    <div className="my-account-balance-wrapper">
      <img src={WalletIcon} width="40px" alt="wallet" />
      <span className="my-account-balance__value">{hatsBalanceString}</span>
      <span className="my-account-balance__title">{t("Header.MyAccount.Balance.title")}</span>
    </div>
  )
}
