import { HatsAllocation } from "./components/HatsAllocation";
import { HatsUtility } from "./components/HatsUtility";
import { HatsVision } from "./components/HatsVision";
import { StyledHatsTokenInfo } from "./styles";

export const HatsTokenInfo = () => {
  return (
    <StyledHatsTokenInfo>
      <HatsVision />
      <HatsUtility />
      <HatsAllocation />
    </StyledHatsTokenInfo>
  );
};
