import { ChangeEvent, forwardRef, KeyboardEvent, useRef, useState } from "react";
import PasteIcon from "assets/icons/paste.icon.svg";
import CopyIcon from "assets/icons/copy.icon.svg";
import RemoveIcon from "assets/icons/delete.icon.svg";
import { StyledFormInput } from "./styles";
import { parseIsDirty } from "../utils";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";

const DEFAULT_ROWS = 10;

export type FormInputType = "text" | "textarea" | "number" | "whole-number" | "checkbox" | "radio" | "password";

type FormInputProps = {
  type?: FormInputType;
  label?: string;
  helper?: string;
  rows?: number;
  pastable?: boolean;
  noErrorLabel?: boolean;
  copyable?: boolean;
  disabled?: boolean;
  removable?: boolean;
  colorable?: boolean;
  isDirty?: boolean;
  noMargin?: boolean;
  selectAllOnClick?: boolean;
  prefixIcon?: JSX.Element;
  error?: { message?: string; type: string };
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

function FormInputComponent(
  {
    pastable = false,
    copyable = false,
    removable = false,
    noErrorLabel = false,
    type = "text",
    colorable = false,
    disabled = false,
    noMargin = false,
    isDirty = false,
    selectAllOnClick = false,
    rows = DEFAULT_ROWS,
    label,
    error,
    prefixIcon,
    helper,
    ...props
  }: FormInputProps,
  ref
) {
  const [inputType, setInputType] = useState<FormInputType>(type);

  const localRef = useRef<HTMLTextAreaElement | HTMLInputElement>();
  const extraIcons = pastable || copyable || removable || type === "password";

  const areAvailableExtraIcons = inputType === "text" || inputType === "textarea" || inputType === "password";
  const isCheckOrRadio = inputType === "checkbox" || inputType === "radio";

  const isChecked = inputType === "checkbox" || inputType === "radio" ? (localRef.current as any)?.checked : undefined;

  const handleOnChange = (e: ChangeEvent<any>) => {
    if (props.onChange) props.onChange(e);
  };

  const handleOnPaste = () => {
    navigator.clipboard.readText().then((text) => (localRef.current!.value = text));
  };

  const handleOnCopy = () => {
    navigator.clipboard.writeText(localRef.current!.value);
  };

  const handleOnClear = () => {
    localRef.current!.value = "";
  };

  const removeNotNumber = (e: KeyboardEvent) => {
    const notAllowedKeys = inputType === "number" ? ["e", "+", "-"] : ["e", "+", "-", ".", ","];
    if (notAllowedKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const getMainComponent = () => {
    const setRef = (r: any) => {
      if (ref && typeof ref === "function") ref(r);
      else if (ref && typeof ref === "object") ref.current = r;
      localRef.current = r;
    };

    const onClick = selectAllOnClick ? (event) => event?.target.select() : undefined;

    if (inputType === "textarea") {
      return (
        <textarea
          {...props}
          disabled={disabled}
          id={props.name}
          ref={setRef}
          rows={rows}
          onChange={handleOnChange}
          onClick={onClick}
        />
      );
    } else if (inputType === "number") {
      return (
        <input
          {...props}
          disabled={disabled}
          id={props.name}
          type="number"
          ref={setRef}
          onChange={handleOnChange}
          onKeyDown={removeNotNumber}
          onClick={onClick}
        />
      );
    } else if (inputType === "whole-number") {
      return (
        <input
          {...props}
          disabled={disabled}
          id={props.name}
          type="number"
          ref={setRef}
          onChange={handleOnChange}
          onKeyDown={removeNotNumber}
          onClick={onClick}
        />
      );
    } else {
      return (
        <input
          {...props}
          disabled={disabled}
          id={props.name}
          type={inputType}
          ref={setRef}
          onChange={handleOnChange}
          onClick={onClick}
        />
      );
    }
  };

  return (
    <StyledFormInput
      isDirty={parseIsDirty(isDirty) && colorable}
      isCheckOrRadio={isCheckOrRadio}
      isChecked={isChecked}
      noLabel={!label}
      hasError={!!error && colorable}
      type={inputType}
      disabled={disabled}
      noMargin={noMargin}
      withPrefixIcon={!!prefixIcon}
      withExtraicons={extraIcons}
      colorable={colorable}
    >
      <div className="main-container">
        {label && (
          <label htmlFor={props.name}>
            <span className="checkbox-inner">
              <span className="checkbox-switch" />
            </span>

            {label}
          </label>
        )}

        <div className="input-container">
          {prefixIcon && <div className="prefix-icon">{prefixIcon}</div>}
          {getMainComponent()}

          {!disabled && extraIcons && areAvailableExtraIcons && (
            <div className="extra-icons">
              {pastable && <img alt="paste" src={PasteIcon} onClick={handleOnPaste} />}
              {copyable && <img alt="copy" src={CopyIcon} onClick={handleOnCopy} />}
              {removable && <img alt="remove" src={RemoveIcon} onClick={handleOnClear} />}
              {type === "password" && (
                <EyeIcon className="icon" onClick={() => setInputType((prev) => (prev === "password" ? "text" : "password"))} />
              )}
            </div>
          )}
        </div>
      </div>

      {error && !noErrorLabel && <span className="error">{error.message}</span>}
      {!error && helper && <span className="helper">{helper}</span>}
    </StyledFormInput>
  );
}

export const FormInput = forwardRef(FormInputComponent);
