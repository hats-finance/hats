import { ChangeEvent, forwardRef, useRef } from "react";
import { StyledFormRadioInput } from "./styles";
import { parseIsDirty } from "../utils";

type FormRadioInputProps = {
  label?: string;
  colorable?: boolean;
  error?: { message?: string; type: string };
  radioOptions: { label: string; value: string }[];
  type?: "radio";
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function FormRadioInputComponent(
  { colorable = false, disabled = false, label, error, type = "radio", ...props }: FormRadioInputProps,
  ref
) {
  const localRef = useRef<HTMLTextAreaElement | HTMLInputElement>();

  const handleOnChange = (e: ChangeEvent<any>) => {
    if (props.onChange) props.onChange(e);
  };

  const getMainComponent = () => {
    const setRef = (r: any) => {
      if (ref && typeof ref === "function") ref(r);
      else if (ref && typeof ref === "object") ref.current = r;
      localRef.current = r;
    };

    return (
      <div className="input-container">
        {props.radioOptions.map((option, index) => (
          <div className="radio-option" key={index}>
            <input
              ref={setRef}
              type={type}
              disabled={disabled}
              id={`radio-${option.value}`}
              name={props.name}
              value={option.value}
              onChange={handleOnChange}
            />
            <label htmlFor={`radio-${option.value}`}>{option.label}</label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <StyledFormRadioInput hasError={!!error && colorable} disabled={disabled} colorable={colorable}>
      <div className="main-container">
        {label && <label className="main-label">{label}</label>}
        {getMainComponent()}
      </div>

      {error && <span className="error">{error.message}</span>}
    </StyledFormRadioInput>
  );
}

export const FormRadioInput = forwardRef(FormRadioInputComponent);
