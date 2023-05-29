import { toggleMenu } from "actions";
import { ReactComponent as AuditsIcon } from "assets/icons/custom/audits.svg";
import { ReactComponent as BountiesIcon } from "assets/icons/custom/bounties.svg";
import { ReactComponent as SubmissionsIcon } from "assets/icons/custom/submissions.svg";
// import GovIcon from "assets/icons/custom/gov.svg";
import { RoutePaths } from "navigation";
import { HoneypotsRoutePaths } from "pages/Honeypots/router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { StyledNavLink } from "./styles";

export default function NavLinks() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleClick = () => dispatch(toggleMenu(false));

  return (
    <>
      <StyledNavLink className="bounties" to={`${RoutePaths.vaults}/${HoneypotsRoutePaths.bugBounties}`} onClick={handleClick}>
        <BountiesIcon />
        <p className="normal">{t("bugBounties")}</p>
        <p className="collapsed">{t("bugBounties")}</p>
      </StyledNavLink>
      <StyledNavLink className="audits" to={`${RoutePaths.vaults}/${HoneypotsRoutePaths.audits}`} onClick={handleClick}>
        <AuditsIcon />
        <p className="normal">{t("auditCompetitions")}</p>
        <p className="collapsed">{t("competitions")}</p>
      </StyledNavLink>
      <StyledNavLink className="vulnerability" to={RoutePaths.vulnerability} onClick={handleClick}>
        <SubmissionsIcon />
        <p className="normal">{t("submitVulnerability")}</p>
        <p className="collapsed">{t("submit")}</p>
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.committee_tools} className="hidden" onClick={handleClick}>
        <p className="normal">{t("committeeTools")}</p>
        <p className="collapsed">{t("committeeTools")}</p>
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.vault_editor} className="hidden" onClick={handleClick}>
        <p className="normal">{t("vaultEditor")}</p>
        <p className="collapsed">{t("vaultEditor")}</p>
      </StyledNavLink>
    </>
  );
}
