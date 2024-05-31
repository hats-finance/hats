import { Loading } from "components";
import { RoutePaths } from "navigation";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { PointsOverview } from "./Sections/PointsOverview/PointsOverview";
import { StyledMyWalletPage } from "./styles";

export const MyWalletPage = () => {
  const { t } = useTranslation();

  const { address: account } = useAccount();
  const { data: createdProfile, isLoading: isLoadingProfile } = useProfileByAddress(account);

  if ((!createdProfile && !isLoadingProfile) || !account) return <Navigate to={RoutePaths.vaults} replace={true} />;

  return (
    <>
      {createdProfile && (
        <StyledMyWalletPage className="content-wrapper">
          <h2>Hello, @{createdProfile?.username}</h2>

          <PointsOverview />
        </StyledMyWalletPage>
      )}
      {isLoadingProfile && <Loading extraText={`${t("HackerProfile.loadingProfile")}...`} />}
    </>
  );
};
