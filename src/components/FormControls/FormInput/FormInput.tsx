import { ChangeEvent, forwardRef, KeyboardEvent, useRef } from "react";
import PasteIcon from "assets/icons/paste.icon.svg";
import CopyIcon from "assets/icons/copy.icon.svg";
import RemoveIcon from "assets/icons/delete.icon.svg";
import { StyledFormInput } from "./styles";
import { parseIsDirty } from "../utils";

const DEFAULT_ROWS = 10;

export type FormInputType = "text" | "textarea" | "number" | "checkbox" | "radio";

type FormInputProps = {
  type?: FormInputType;
  label?: string;
  pastable?: boolean;
  copyable?: boolean;
  removable?: boolean;
  colorable?: boolean;
  isDirty?: boolean;
  error?: { message: string; type: string };
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

function FormInputComponent(
  {
    pastable = false,
    copyable = false,
    removable = false,
    type = "text",
    colorable = false,
    isDirty = false,
    label,
    error,
    ...props
  }: FormInputProps,
  ref
) {
  const localRef = useRef<HTMLTextAreaElement | HTMLInputElement>();
  const extraIcons = pastable || copyable || removable;

  const refToUse = ref || localRef;

  const areAvailableExtraIcons = type === "text" || type === "textarea";
  const isCheckOrRadio = type === "checkbox" || type === "radio";

  const handleOnChange = (e: ChangeEvent<any>) => {
    if (props.onChange) props.onChange(e);
  };

  const handleOnPaste = () => {
    navigator.clipboard.readText().then((text) => (refToUse.current!.value = text));
  };

  const handleOnCopy = () => {
    navigator.clipboard.writeText(refToUse.current!.value);
  };

  const handleOnClear = () => {
    refToUse.current!.value = "";
  };

  const removeNotNumber = (e: KeyboardEvent) => {
    const notAllowedKeys = ["e", "+", "-"];
    if (notAllowedKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const getMainComponent = () => {
    if (type === "text") {
      return <input {...props} id={props.name} type="text" ref={refToUse} onChange={handleOnChange} />;
    } else if (type === "textarea") {
      return <textarea {...props} id={props.name} ref={refToUse} rows={DEFAULT_ROWS} onChange={handleOnChange} />;
    } else if (type === "number") {
      return <input {...props} id={props.name} type={type} ref={refToUse} onChange={handleOnChange} onKeyDown={removeNotNumber} />;
    } else {
      return <input {...props} id={props.name} type={type} ref={refToUse} onChange={handleOnChange} />;
    }
  };

  return (
    <StyledFormInput
      isDirty={parseIsDirty(isDirty) && colorable}
      isCheckOrRadio={isCheckOrRadio}
      hasError={!!error && colorable}
      type={type}
      withExtraicons={extraIcons}>
      <div className="main-container">
        {label && <label htmlFor={props.name}>{label}</label>}

        <div className="input-container">
          {getMainComponent()}

          {extraIcons && areAvailableExtraIcons && (
            <div className="extra-icons">
              {pastable && <img alt="paste" src={PasteIcon} onClick={handleOnPaste} />}
              {copyable && <img alt="copy" src={CopyIcon} onClick={handleOnCopy} />}
              {removable && <img alt="remove" src={RemoveIcon} onClick={handleOnClear} />}
            </div>
          )}
        </div>
      </div>

      {error && <span className="error">{error.message}</span>}
    </StyledFormInput>
  );
}

export const FormInput = forwardRef(FormInputComponent);
