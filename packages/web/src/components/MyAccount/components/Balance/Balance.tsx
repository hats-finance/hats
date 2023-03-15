import { useTranslation } from "react-i18next";
import { BigNumber } from "ethers";
import WalletIcon from "assets/icons/balance.svg";
import { Amount } from "utils/amounts.utils";
import { StyledBalance } from "./styles";

export default function Balance() {
  const { t } = useTranslation();
  // const { address: account } = useAccount();
  // const { masters } = useVaults();
  const hatsBalance = new Amount(BigNumber.from(0), "18");

  // return (
  //   <StyledBalance>
  //     <img src={WalletIcon} width="40px" alt="wallet" />
  //     <span className="value">{hatsBalance.formattedWithoutSymbol(4)}</span>
  //     <span className="title">{t("Header.MyAccount.Balance.title")}</span>
  //   </StyledBalance>
  // );
}
