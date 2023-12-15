import { isAddressAMultisigMember } from "@hats.finance/shared";
import BugIcon from "@mui/icons-material/BugReportOutlined";
import PayoutIcon from "@mui/icons-material/TollOutlined";
import DecryptionTool from "@mui/icons-material/VpnKeyOffOutlined";
import { toggleMenu } from "actions";
import { ReactComponent as AuditsIcon } from "assets/icons/custom/audits.svg";
import { ReactComponent as BountiesIcon } from "assets/icons/custom/bounties.svg";
import { ReactComponent as CommitteeToolsIcon } from "assets/icons/custom/committee_tools.svg";
import { ReactComponent as LeaderboardIcon } from "assets/icons/custom/leaderboard.svg";
import { ReactComponent as PrivateAuditsIcon } from "assets/icons/custom/private-audits.svg";
import { ReactComponent as VaultEditorIcon } from "assets/icons/custom/vault_editor.svg";
import { utils } from "ethers";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useIsGovMember } from "hooks/useIsGovMember";
import useOnClickOutside from "hooks/useOnClickOutside";
import { RoutePaths } from "navigation";
import { HoneypotsRoutePaths } from "pages/Honeypots/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAccount, useNetwork } from "wagmi";
import { StyledNavLink, StyledNavLinkNoRouter, StyledNavLinksList } from "./styles";

export default function NavLinks() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const { allVaultsOnEnv } = useVaults();
  const { chain } = useNetwork();
  const { address } = useAccount();

  const isGovMember = useIsGovMember();
  const [isInvitedToPrivateAudits, setIsInvitedToPrivateAudits] = useState(false);
  const [isCommitteeAddress, setIsCommitteeAddress] = useState(false);
  const [showCommitteeToolsSubroutes, setshowCommitteeToolsSubroutes] = useState(false);
  const committeeToolsSubrouteRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(committeeToolsSubrouteRef, () => setshowCommitteeToolsSubroutes(false));

  const handleClick = () => {
    dispatch(toggleMenu(false));
    setshowCommitteeToolsSubroutes(false);
  };

  useEffect(() => {
    if (!allVaultsOnEnv || !address) return setIsInvitedToPrivateAudits(false);

    const isInvited =
      allVaultsOnEnv.some(
        (vault) =>
          vault.description?.["project-metadata"].isPrivateAudit &&
          vault.description?.["project-metadata"].whitelist.some(
            (whiteAddress) => whiteAddress.address.toLowerCase() === address.toLowerCase()
          )
      ) ?? false;

    setIsInvitedToPrivateAudits(isInvited);
  }, [allVaultsOnEnv, address]);

  useEffect(() => {
    const verifyIfCommitteeAddress = async () => {
      try {
        if (!chain || !allVaultsOnEnv || allVaultsOnEnv.length === 0) return setIsCommitteeAddress(false);

        const verifyCommitteeCalls: Promise<boolean>[] = [];
        const allCommittees = new Set(allVaultsOnEnv.map((vault) => utils.getAddress(vault.committee)));
        allCommittees.forEach((committee) => {
          verifyCommitteeCalls.push(isAddressAMultisigMember(committee, address, chain.id));
        });

        const isCommitteeAddress = await Promise.all(verifyCommitteeCalls).then((results) => results.some((result) => result));
        return setIsCommitteeAddress(isCommitteeAddress);
      } catch (error) {
        setIsCommitteeAddress(false);
      }
    };
    verifyIfCommitteeAddress();
  }, [allVaultsOnEnv, chain, address]);

  return (
    <StyledNavLinksList>
      <StyledNavLink className="bounties" to={`${HoneypotsRoutePaths.bugBounties}`} onClick={handleClick}>
        <BountiesIcon />
        <p className="normal">{t("bugBounties")}</p>
        <p className="collapsed">{t("bugBounties")}</p>
      </StyledNavLink>
      <StyledNavLink className="audits" to={`${HoneypotsRoutePaths.audits}`} onClick={handleClick}>
        <AuditsIcon />
        <p className="normal">{t("auditCompetitions")}</p>
        <p className="collapsed">{t("competitions")}</p>
      </StyledNavLink>
      <StyledNavLink
        hidden={!isInvitedToPrivateAudits && !isGovMember}
        className="audits"
        to={`${HoneypotsRoutePaths.privateAudits}`}
        onClick={handleClick}
      >
        <PrivateAuditsIcon />
        <p className="normal">{t("privateAuditCompetitions")}</p>
        <p className="collapsed">{t("privateCompetitions")}</p>
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.leaderboard} onClick={handleClick}>
        <LeaderboardIcon />
        <p className="normal">{t("leaderboard")}</p>
        <p className="collapsed">{t("leaderboard")}</p>
      </StyledNavLink>
      {/* <StyledNavLink className="vulnerability" to={RoutePaths.vulnerability} onClick={handleClick}>
        <SubmissionsIcon />
        <p className="normal">{t("submitVulnerability")}</p>
        <p className="collapsed">{t("submit")}</p>
      </StyledNavLink> */}
      <StyledNavLink to={RoutePaths.vault_editor} onClick={handleClick}>
        <VaultEditorIcon />
        <p className="normal">{t("addYourProject")}</p>
        <p className="collapsed">{t("addYourProject")}</p>
      </StyledNavLink>
      <div className="committee-tools">
        <StyledNavLinkNoRouter
          hidden={!isCommitteeAddress}
          className={`${location.pathname.includes(`${RoutePaths.committee_tools}`) ? "active" : ""}`}
          onClick={() => setshowCommitteeToolsSubroutes((prev) => !prev)}
        >
          <CommitteeToolsIcon />
          <p className="normal">{t("committeeTools")}</p>
          <p className="collapsed">{t("committeeTools")}</p>
        </StyledNavLinkNoRouter>
        {showCommitteeToolsSubroutes && (
          <div ref={committeeToolsSubrouteRef} className="committee-tools-subroutes">
            <StyledNavLink
              className="sub"
              // hidden={!location.pathname.includes(`${RoutePaths.committee_tools}`)}
              to={`${RoutePaths.committee_tools}/submissions`}
              onClick={handleClick}
            >
              <BugIcon />
              <p className="normal">{t("submissions")}</p>
              <p className="collapsed">{t("submissions")}</p>
            </StyledNavLink>
            <StyledNavLink
              className="sub"
              // hidden={!location.pathname.includes(`${RoutePaths.committee_tools}`)}
              to={`${RoutePaths.committee_tools}/payouts`}
              onClick={handleClick}
            >
              <PayoutIcon />
              <p className="normal">{t("payouts")}</p>
              <p className="collapsed">{t("payouts")}</p>
            </StyledNavLink>
            <StyledNavLink
              className="sub"
              // hidden={!location.pathname.includes(`${RoutePaths.committee_tools}`)}
              to={`${RoutePaths.committee_tools}`}
              end
              onClick={handleClick}
            >
              <DecryptionTool />
              <p className="normal">{t("decryptionTool")}</p>
              <p className="collapsed">{t("decryptionTool")}</p>
            </StyledNavLink>
          </div>
        )}
      </div>
    </StyledNavLinksList>
  );
}
