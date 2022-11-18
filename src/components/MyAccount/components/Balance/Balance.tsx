import { formatEther } from "@ethersproject/units";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { useTranslation } from "react-i18next";
import { useVaults } from "hooks/vaults/useVaults";
import WalletIcon from "assets/icons/balance.svg";
import { StyledBalance } from "./styles";

export default function Balance() {
  const { t } = useTranslation();
  const { account } = useEthers();
  const { masters } = useVaults();
  const hatsBalance = formatEther(useTokenBalance(masters?.[0].rewardsToken, account) ?? 0);
  const hatsBalanceString = (+hatsBalance).toFixed(4);

  return (
    <StyledBalance>
      <img src={WalletIcon} width="40px" alt="wallet" />
      <span className="value">{hatsBalanceString}</span>
      <span className="title">{t("Header.MyAccount.Balance.title")}</span>
    </StyledBalance>
  );
}
