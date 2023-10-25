import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { toggleMenu } from "actions/index";
import { Button, Pill, SafePeriodBar, WalletButton, WhereverWidget } from "components";
import { useProfileByAddress } from "hooks/profiles/useProfileByAddress";
import { RoutePaths } from "navigation";
import { HoneypotsRoutePaths } from "pages/Honeypots/router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "reducers";
import { useAccount } from "wagmi";
import { StyledHeader } from "./styles";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showMenu } = useSelector((state: RootState) => state.layoutReducer);
  const { address: account } = useAccount();

  const { data: createdProfile, isLoading: isLoadingProfile } = useProfileByAddress(account);

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === `${HoneypotsRoutePaths.bugBounties}`) return t("bugBounties");
    if (path === `${HoneypotsRoutePaths.audits}`) return t("auditCompetitions");
    if (path.includes(`${RoutePaths.vulnerability}`)) return t("submitVulnerability");
    if (path.includes(`${RoutePaths.vault_editor}`)) return t("vaultEditor");
    if (path.includes(`${RoutePaths.committee_tools}`)) return t("committeeTools");
    return "";
  };

  return (
    <StyledHeader>
      <div className="safety-period-banner">
        <SafePeriodBar type="banner" />
      </div>

      <div className="content">
        <h1 className="page-title">{getPageTitle()}</h1>

        <div className="buttons">
          {account && !isLoadingProfile && (
            <>
              {!!createdProfile ? (
                <Button size="big" noRadius styleType="outlined">
                  {t("Header.myProfile")}
                </Button>
              ) : (
                <>
                  <Pill capitalize text="New feature" />
                  <Button size="big" noRadius styleType="outlined">
                    {t("Header.createHackerProfile")}
                  </Button>
                </>
              )}
            </>
          )}

          <WhereverWidget />
          <WalletButton />

          <div className="menu-button" onClick={() => dispatch(toggleMenu(!showMenu))}>
            {showMenu ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
          </div>
        </div>
      </div>
    </StyledHeader>
  );
};

export { Header };
