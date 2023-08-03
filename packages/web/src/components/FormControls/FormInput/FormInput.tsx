import CopyIcon from "@mui/icons-material/ContentCopyOutlined";
import PasteIcon from "@mui/icons-material/ContentPasteOutlined";
import RemoveIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import { ChangeEvent, KeyboardEvent, forwardRef, useRef, useState } from "react";
import { parseIsDirty } from "../utils";
import { StyledFormInput } from "./styles";

const DEFAULT_ROWS = 10;

export type FormInputType = "text" | "textarea" | "number" | "whole-number" | "checkbox" | "toggle" | "radio" | "password";

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
  maxDecimals?: number;
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
    maxDecimals,
    selectAllOnClick = false,
    rows = DEFAULT_ROWS,
    label,
    error,
    prefixIcon,
    helper,
    readOnly,
    className,
    onKeyDown,
    ...props
  }: FormInputProps,
  ref
) {
  const [inputType, setInputType] = useState<FormInputType>(type);
  const [, setChanged] = useState(false);

  const localRef = useRef<HTMLTextAreaElement | HTMLInputElement>();
  const extraIcons = pastable || copyable || removable || type === "password";

  const areAvailableExtraIcons = inputType === "text" || inputType === "textarea" || inputType === "password";
  const isCheckOrRadio = inputType === "checkbox" || inputType === "toggle" || inputType === "radio";

  const isChecked =
    inputType === "checkbox" || inputType === "toggle" || inputType === "radio" ? (localRef.current as any)?.checked : undefined;

  const handleOnChange = (e: ChangeEvent<any>) => {
    if (inputType === "number") {
      const value = e.target.value;

      if (maxDecimals !== undefined) {
        const numDecimals = value.split(".")[1]?.length || value.split(",")[1]?.length || 0;
        if (numDecimals > maxDecimals) {
          const newValue = value.slice(0, value.length - 1);
          localRef.current!.value = newValue;
          if (props.onChange) props.onChange({ ...e, target: { ...e.target, value: newValue } });
          return;
        }
      }
      if (props.onChange) props.onChange(e);
    } else {
      if (props.onChange) props.onChange(e);

      // Handle rerender, only with checkboxes
      if (isCheckOrRadio) setChanged((prev) => !prev);
    }
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
          onKeyDown={(e) => {
            if (onKeyDown) onKeyDown(e);
          }}
          onClick={onClick}
          readOnly={readOnly}
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
          onKeyDown={(e) => {
            if (onKeyDown) onKeyDown(e);
            removeNotNumber(e);
          }}
          onClick={onClick}
          readOnly={readOnly}
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
          onKeyDown={(e) => {
            if (onKeyDown) onKeyDown(e);
            removeNotNumber(e);
          }}
          onClick={onClick}
          readOnly={readOnly}
        />
      );
    } else if (inputType === "toggle") {
      return (
        <input
          {...props}
          disabled={disabled}
          id={props.name}
          type="checkbox"
          ref={setRef}
          onChange={handleOnChange}
          onKeyDown={(e) => {
            if (onKeyDown) onKeyDown(e);
          }}
          onClick={onClick}
          readOnly={readOnly}
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
          onKeyDown={(e) => {
            if (onKeyDown) onKeyDown(e);
          }}
          onClick={onClick}
          readOnly={readOnly}
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
      readOnly={readOnly}
      className={className}
    >
      <div className="main-container">
        {label !== undefined && (
          <label htmlFor={props.name}>
            <span className="checkbox-inner">
              <span className="checkbox-switch" />
            </span>

            <span>{label}</span>
          </label>
        )}

        <div className="input-container">
          {prefixIcon && <div className="prefix-icon">{prefixIcon}</div>}
          {getMainComponent()}

          {!disabled && extraIcons && areAvailableExtraIcons && (
            <div className="extra-icons">
              {pastable && <PasteIcon className="icon" onClick={handleOnPaste} />}
              {copyable && <CopyIcon className="icon" onClick={handleOnCopy} />}
              {removable && <RemoveIcon className="icon" onClick={handleOnClear} />}
              {type === "password" && (
                <EyeIcon className="icon" onClick={() => setInputType((prev) => (prev === "password" ? "text" : "password"))} />
              )}
            </div>
          )}
        </div>
      </div>

      {error && error.message && !noErrorLabel && <span className="error">{error.message}</span>}
      {!error && helper && <span className="helper">{helper}</span>}
    </StyledFormInput>
  );
}

export const FormInput = forwardRef(FormInputComponent);
