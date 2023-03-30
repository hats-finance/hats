import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import PayoutIcon from "assets/icons/payout.svg";
import { Alert, WalletButton } from "components";
import { StyledPayoutsWelcome } from "./styles";

export const PayoutsWelcome = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  return (
    <StyledPayoutsWelcome>
      <div className="container">
        <div className="title-container">
          <img src={PayoutIcon} alt="payout" />
          <p className="title">{t("Payouts.welcomeTitle")}</p>
        </div>

        {address ? (
          <>
            <Alert className="mb-4" type="error">
              {t("Payouts.yourWalletIsNotACommittee")}
            </Alert>
            <WalletButton expanded />
          </>
        ) : (
          <>
            <p className="mb-5">{t("Payouts.connectWithACommitteeMemberWallet")}</p>
            <WalletButton expanded />
          </>
        )}
      </div>
    </StyledPayoutsWelcome>
  );
};
