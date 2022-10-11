import NavLinks from "../NavLinks/NavLinks";
import SocialAndLegal from "../SocialAndLegal/SocialAndLegal";
import { StyledMenu } from "./styles";

type MenuProps = {
  show: boolean;
}

export default function Menu({show}: MenuProps) {
  return (
    <StyledMenu show={show} className="onlyMobile">
      <NavLinks />
      <SocialAndLegal />
    </StyledMenu>
  )
}
