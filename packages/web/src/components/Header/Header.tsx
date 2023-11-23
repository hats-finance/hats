import { getGnosisSafeInfo } from "@hats-finance/shared";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { toggleMenu } from "actions/index";
import { Button, HackerProfileImage, SafePeriodBar, WalletButton, WhereverWidget } from "components";
import useModal from "hooks/useModal";
import { RoutePaths } from "navigation";
import { CreateProfileFormModal } from "pages/HackerProfile/components";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { HoneypotsRoutePaths } from "pages/Honeypots/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "reducers";
import { useAccount, useNetwork } from "wagmi";
import { StyledHeader } from "./styles";

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showMenu } = useSelector((state: RootState) => state.layoutReducer);
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const [isSafeAddress, setIsSafeAddress] = useState<boolean>();
  const { isShowing: isShowingCreateProfile, show: showCreateProfile, hide: hideCreateProfile } = useModal();

  const { data: createdProfile, isLoading: isLoadingProfile } = useProfileByAddress(account);

  useEffect(() => {
    // Check if address is Safe multisig
    if (!account || !chain) return;
    const checkIsSafeAddress = async () => {
      const { isSafeAddress } = await getGnosisSafeInfo(account, chain.id);
      setIsSafeAddress(isSafeAddress);
    };
    checkIsSafeAddress();
  }, [account, chain]);

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === `${HoneypotsRoutePaths.bugBounties}`) return t("bugBounties");
    if (path === `${HoneypotsRoutePaths.audits}`) return t("auditCompetitions");
    if (path.includes(`${RoutePaths.vulnerability}`)) return t("submitVulnerability");
    if (path.includes(`${RoutePaths.vault_editor}`)) return t("vaultEditor");
    if (path.includes(`${RoutePaths.committee_tools}`)) return t("committeeTools");
    return "";
  };

  function handleGoToProfile() {
    if (!createdProfile) return;
    navigate(`${RoutePaths.profile}/${createdProfile.username}`);
  }

  return (
    <StyledHeader>
      <div className="safety-period-banner">
        <SafePeriodBar type="banner" />
      </div>

      <div className="content">
        <h1 className="page-title">{getPageTitle()}</h1>

        <div className="buttons">
          <div className="profile-button">
            {isSafeAddress !== undefined && !isSafeAddress && account && !isLoadingProfile && (
              <>
                {!!createdProfile ? (
                  <Button size="big" noRadius styleType="outlined" noPadding onClick={handleGoToProfile}>
                    <div className="inner-profile-button">
                      <HackerProfileImage hackerProfile={createdProfile} size="xsmall" noMargin />
                      <span>{createdProfile.username}</span>
                    </div>
                  </Button>
                ) : (
                  <>
                    {/* <Pill capitalize text="New feature" /> */}
                    <Button size="big" noRadius styleType="outlined" onClick={() => showCreateProfile()}>
                      {t("Header.createHackerProfile")}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          <WhereverWidget />
          <WalletButton />

          <div className="menu-button" onClick={() => dispatch(toggleMenu(!showMenu))}>
            {showMenu ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
          </div>
        </div>
      </div>

      <CreateProfileFormModal isShowing={isShowingCreateProfile} onHide={hideCreateProfile} />
    </StyledHeader>
  );
};

export { Header };
