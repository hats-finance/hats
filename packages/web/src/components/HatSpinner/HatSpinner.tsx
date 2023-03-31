import { StyledHatSpinner } from "./styles";

type HatSpinnerProps = {
  expanded?: boolean;
  text?: string;
};

export const HatSpinner = ({ expanded = false, text }: HatSpinnerProps) => {
  return (
    <StyledHatSpinner expanded={expanded}>
      <div className="hat-loader" />
      {text && <span>{text}</span>}
    </StyledHatSpinner>
  );
};
