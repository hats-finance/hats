import { AirdropCheckElegibility } from "./components/AirdropCheckElegibility/AirdropCheckElegibility";
import { AirdropFAQ } from "./components/AirdropFAQ/AirdropFAQ";
import { StyledAirdropsPage } from "./styles";

export const AirdropsPage = () => {
  return (
    <StyledAirdropsPage>
      <AirdropCheckElegibility />
      {/* <AirdropFAQ /> */}
    </StyledAirdropsPage>
  );
};
