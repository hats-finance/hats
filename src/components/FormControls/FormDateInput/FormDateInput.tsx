import React, { ChangeEvent, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "../ErrorMessage";
import { StyledFormInput } from "../FormInput/styles";
import { parseIsDirty } from "../utils";

type FormDateInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  colorable?: boolean;
  withTime?: boolean;
  isDirty?: boolean | boolean[];
  error?: { message: string; type: string };
  onChange: (data: number) => void;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function FormDateInputComponent(
  { value, onChange, name, colorable = false, isDirty = false, withTime = false, placeholder, error, label }: FormDateInputProps,
  ref
) {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const timestampSeconds = new Date(e.target.value).getTime() / 1000;
    onChange(timestampSeconds);
  };

  const getDateFromTimestamp = (timestampSeconds: number) => {
    if (!timestampSeconds) return "";
    const date = new Date(0);
    date.setUTCSeconds(timestampSeconds);

    if (withTime) {
      const dd_mm_yyyy = date.toLocaleDateString();

      const hh_mm_ss = date.toLocaleTimeString();
      const hh_mm = hh_mm_ss.split(":").slice(0, 2).join(":");

      const yyyy_mm_ddThh_mm = `${dd_mm_yyyy.replace(/(\d+)\/(\d+)\/(\d+)/g, "$3-$2-$1")}T${hh_mm}`;
      return yyyy_mm_ddThh_mm;
    } else {
      const dd_mm_yyyy = date.toLocaleDateString();
      const yyyy_mm_dd = dd_mm_yyyy.replace(/(\d+)\/(\d+)\/(\d+)/g, "$3-$2-$1");
      return yyyy_mm_dd;
    }
  };

  return (
    <StyledFormInput isDirty={parseIsDirty(isDirty) && colorable} hasError={!!error && colorable}>
      <div className="main-container">
        {label && <label htmlFor={name}>{label}</label>}

        <input
          name={name}
          id={name}
          value={getDateFromTimestamp(value as number)}
          type={withTime ? "datetime-local" : "date"}
          placeholder={placeholder}
          ref={ref}
          onChange={handleOnChange}
        />
      </div>
      {error && <ErrorMessage error={error} />}
    </StyledFormInput>
  );
}

export const FormDateInput = forwardRef(FormDateInputComponent);
