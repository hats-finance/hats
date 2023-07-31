import { SpinnerContainer } from "./styles";

type SpinnerProps = {
  text?: string;
};

export const Spinner = ({ text }: SpinnerProps) => {
  return (
    <SpinnerContainer>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <span>{text}</span>}
    </SpinnerContainer>
  );
};
