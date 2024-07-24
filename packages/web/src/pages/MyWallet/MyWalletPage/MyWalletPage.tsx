import { Alert, WalletButton } from "components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { shortenAddress } from "utils/addresses.utils";
import { useAccount } from "wagmi";
import { DaoOverview } from "./Sections/DaoOverview/DaoOverview";
import { LinearReleaseDashboard } from "./Sections/LinearReleaseDashboard/LinearReleaseDashboard";
// import { SecurePay } from "./Sections/SecurePay/SecurePay";
import { StyledMyWalletPage } from "./styles";

export const MyWalletPage = () => {
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] = useState<"dao" | "linear_release" | "secure_pay">("dao");

  const { address: account } = useAccount();
  // const { data: createdProfile, isLoading: isLoadingProfile } = useProfileByAddress(account);

  if (!account)
    return (
      <>
        <Alert className="mb-3" type="warning">
          <span>{t("youNeedToConnectToAWallet")}</span>
        </Alert>

        <div className="mt-5">
          <WalletButton expanded />
        </div>
      </>
    );

  const sections = {
    dao: <DaoOverview />,
    linear_release: <LinearReleaseDashboard />,
    // secure_pay: <SecurePay />,
  };

  return (
    <>
      {account && (
        <StyledMyWalletPage className="content-wrapper">
          <h2>Hello, {shortenAddress(account, { startLength: 6 })}</h2>

          <div className="sections-handler">
            {(["dao", "linear_release" /* "secure_pay"*/] as const).map((section) => (
              <h3
                className={`section ${selectedSection === section ? "selected" : ""}`}
                onClick={() => setSelectedSection(section)}
              >
                {t(`MyWallet.${section}`)}
              </h3>
            ))}
          </div>

          {sections[selectedSection]}
        </StyledMyWalletPage>
      )}
      {/* {isLoadingProfile && <Loading extraText={`${t("HackerProfile.loadingProfile")}...`} />} */}
    </>
  );
};
