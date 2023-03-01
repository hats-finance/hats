import { useTranslation } from "react-i18next";
import { useTokenBalanceAmount } from "hooks/wagmi";
import { useVaults } from "hooks/vaults/useVaults";
import WalletIcon from "assets/icons/balance.svg";
import { StyledBalance } from "./styles";
import { useAccount } from "wagmi";

export default function Balance() {
  return <></>;
  // const { t } = useTranslation();
  // const { address: account } = useAccount();
  // const { masters } = useVaults();
  // const hatsBalance = useTokenBalanceAmount({ token: masters?.[0].rewardsToken, address: account });

  // return (
  //   <StyledBalance>
  //     <img src={WalletIcon} width="40px" alt="wallet" />
  //     <span className="value">{hatsBalance.formattedWithoutSymbol(4)}</span>
  //     <span className="title">{t("Header.MyAccount.Balance.title")}</span>
  //   </StyledBalance>
  // );
}
