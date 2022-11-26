import { useTranslation } from "react-i18next";
import { useBalanceAmount } from "hooks";
import { useVaults } from "hooks/vaults/useVaults";
import WalletIcon from "assets/icons/balance.svg";
import { StyledBalance } from "./styles";
import { useAccount } from "wagmi";

export default function Balance() {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { masters } = useVaults();
  const hatsBalance = useBalanceAmount({ token: masters?.[0].rewardsToken, address: account, watch: true });

  return (
    <StyledBalance>
      <img src={WalletIcon} width="40px" alt="wallet" />
      <span className="value">{hatsBalance.formattedWithoutSymbol(4)}</span>
      <span className="title">{t("Header.MyAccount.Balance.title")}</span>
    </StyledBalance>
  );
}
