import React, { ChangeEvent, forwardRef } from "react";
import { StyledFormInput } from "../FormInput/styles";
import { parseIsDirty } from "../utils";

type FormDateInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  colorable?: boolean;
  isDirty?: boolean | boolean[];
  error?: { message: string; type: string };
  onChange: (data: number) => void;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function FormDateInputComponent(
  { value, onChange, name, colorable = false, isDirty = false, placeholder, error, label }: FormDateInputProps,
  ref
) {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const timestampSeconds = new Date(e.target.value).getTime() / 1000;
    onChange(timestampSeconds);
  };

  const getDateFromTimestamp = (timestampSeconds: number) => {

    const date = new Date(0);
    date.setUTCSeconds(timestampSeconds);

    const dd_mm_yyyy = date.toLocaleDateString();
    const yyyy_mm_dd = dd_mm_yyyy.replace(/(\d+)\/(\d+)\/(\d+)/g, "$3-$2-$1");
    return yyyy_mm_dd;
  };

  return (
    <StyledFormInput isDirty={parseIsDirty(isDirty) && colorable} hasError={!!error && colorable}>
      <div className="main-container">
        {label && <label htmlFor={name}>{label}</label>}

        <input
          name={name}
          id={name}
          value={getDateFromTimestamp(value as number)}
          type="date"
          placeholder={placeholder}
          ref={ref}
          onChange={handleOnChange}
        />
      </div>

      {error && <span className="error">{error.message}</span>}
    </StyledFormInput>
  );
}

export const FormDateInput = forwardRef(FormDateInputComponent);
