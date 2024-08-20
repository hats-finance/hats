import { StyledTermsAndConditions } from "./styles";

var template = {
  __html: `<iframe width="100%" height="${window.innerHeight * 0.55}" style="border: none;" src="${
    window.location.origin
  }/EulerCTFTAndC.html"></iframe>`,
};

export const EulerCTFTAndC = () => {
  return (
    <StyledTermsAndConditions>
      <div dangerouslySetInnerHTML={template} />
    </StyledTermsAndConditions>
  );
};
