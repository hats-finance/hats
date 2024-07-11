import { Loading } from "components";
import { RoutePaths } from "navigation";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { EarningsBreakdown } from "./Sections/EarningsBreakdown/EarningsBreakdown";
import { PointsOverview } from "./Sections/PointsOverview/PointsOverview";
import { StyledMyWalletPage } from "./styles";

export const MyWalletPage = () => {
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] = useState<"dao" | "linear_release" | "secure_pay">("dao");

  const { address: account } = useAccount();
  const { data: createdProfile, isLoading: isLoadingProfile } = useProfileByAddress(account);

  if ((!createdProfile && !isLoadingProfile) || !account) return <Navigate to={RoutePaths.vaults} replace={true} />;

  return (
    <>
      {createdProfile && (
        <StyledMyWalletPage className="content-wrapper">
          <h2>Hello, @{createdProfile?.username}</h2>

          <div className="sections-handler">
            {(["dao", "linear_release", "secure_pay"] as const).map((section) => (
              <h3
                className={`section ${selectedSection === section ? "selected" : ""}`}
                onClick={() => setSelectedSection(section)}
              >
                {t(`MyWallet.${section}`)}
              </h3>
            ))}
          </div>

          <PointsOverview />
          <EarningsBreakdown />
        </StyledMyWalletPage>
      )}
      {isLoadingProfile && <Loading extraText={`${t("HackerProfile.loadingProfile")}...`} />}
    </>
  );
};
