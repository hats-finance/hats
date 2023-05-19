import { toggleMenu } from "actions";
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
      <StyledNavLink to={`${RoutePaths.vaults}/${HoneypotsRoutePaths.bugBounties}`} onClick={handleClick}>
        {t("bugBounties")}
      </StyledNavLink>
      <StyledNavLink to={`${RoutePaths.vaults}/${HoneypotsRoutePaths.audits}`} onClick={handleClick}>
        {t("auditCompetitions")}
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.vulnerability} className="vulnerability" onClick={handleClick}>
        {t("submitVulnerability")}
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.committee_tools} className="hidden" onClick={handleClick}>
        {t("committeeTools")}
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.vault_editor} className="hidden" onClick={handleClick}>
        {t("vaultEditor")}
      </StyledNavLink>
    </>
  );
}
