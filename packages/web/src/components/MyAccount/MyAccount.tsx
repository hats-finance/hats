import { useAccount } from "wagmi";
import { useTranslation } from "react-i18next";
import { shortenIfAddress } from "utils/addresses.utils";
import MyNFTs from "./components/MyNFTs/MyNFTs";
// import Balance from "./components/Balance/Balance";
// import StakingApy from "./components/StakingApy/StakingApy";
// import TotalStaked from "./components/TotalStaked/TotalStaked";
import { StyledMyAccountInfo } from "./styles";

export function MyAccount() {
  const { t } = useTranslation();
  const { address: account } = useAccount();

  return (
    <StyledMyAccountInfo>
      <div className="wallet">
        <span className="wallet__hello">{t("Header.MyAccount.hello")},</span>
        <span className="wallet__address">{shortenIfAddress(account)}</span>
      </div>
      <div className="stats-boxs">
        {/* <Balance />
        <TotalStaked />
        <StakingApy /> */}
      </div>
      <MyNFTs />
    </StyledMyAccountInfo>
  );
}
