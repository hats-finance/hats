import { ChangeEvent, forwardRef, useRef } from "react";
import { StyledFormRadioInput } from "./styles";

type FormRadioInputProps = {
  label?: string;
  colorable?: boolean;
  error?: { message?: string; type: string };
  radioOptions: { label: string; value: string }[];
  type?: "radio";
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function FormRadioInputComponent(
  { colorable = false, disabled = false, label, error, type = "radio", radioOptions, ...props }: FormRadioInputProps,
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
        {radioOptions.map((option, index) => (
          <label htmlFor={`radio-${option.value}`} className="radio-option" key={index}>
            {option.label}
            <input
              {...props}
              ref={setRef}
              type={type}
              disabled={disabled}
              id={`radio-${option.value}`}
              name={props.name}
              value={option.value}
              onChange={handleOnChange}
            />
            <span className="checkmark" />
          </label>
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
