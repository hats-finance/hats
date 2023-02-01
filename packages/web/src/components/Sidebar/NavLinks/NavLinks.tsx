import { useDispatch } from "react-redux";
import { RoutePaths } from "navigation";
import { toggleMenu } from "actions";
import { StyledNavLink } from "./styles";

export default function NavLinks() {
  const dispatch = useDispatch();

  const handleClick = () => dispatch(toggleMenu(false));

  return (
    <>
      <StyledNavLink to={RoutePaths.vaults} onClick={handleClick}>
        Vaults
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.gov} onClick={handleClick}>
        Gov
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.airdrop_machine} onClick={handleClick}>
        Airdrop Machine
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.vulnerability} className="vulnerability" onClick={handleClick}>
        Submit Vulnerability
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.committee_tools} className="hidden" onClick={handleClick}>
        Committee Tools
      </StyledNavLink>
      <StyledNavLink to={RoutePaths.vault_editor} className="hidden" onClick={handleClick}>
        Vault Editor
      </StyledNavLink>
    </>
  );
}
