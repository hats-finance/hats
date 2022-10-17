import { ChangeEvent, forwardRef, useRef } from "react";
import PasteIcon from "assets/icons/paste.icon.svg";
import CopyIcon from "assets/icons/copy.icon.svg";
import RemoveIcon from "assets/icons/delete.icon.svg";
import { StyledFormInput } from "./styles";

const DEFAULT_ROWS = 10;

export type FormInputType = "text" | "textarea";

type FormInputProps = {
  type?: FormInputType;
  label?: string;
  pastable?: boolean;
  copyable?: boolean;
  removable?: boolean;
  colorable?: boolean;
  isDirty?: boolean;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

function FormInputComponent(
  { pastable = false, copyable = false, removable = false, type = "text", colorable = false, isDirty = false, label, ...props }: FormInputProps,
  ref
) {
  const localRef = useRef<HTMLTextAreaElement | HTMLInputElement>();
  const extraIcons = pastable || copyable || removable;

  const refToUse = ref || localRef;

  const areAvailableExtraIcons = type === "text" || type === "textarea";

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

  const getMainComponent = () => {
    if (type === "text") {
      return <input {...props} type="text" ref={refToUse} onChange={handleOnChange} />;
    } else {
      return <textarea {...props} ref={refToUse} rows={DEFAULT_ROWS} onChange={handleOnChange} />;
    }
  };

  return (
    <StyledFormInput isDirty={isDirty && colorable} type={type} withExtraicons={extraIcons}>
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
    </StyledFormInput>
  );
}

export const FormInput = forwardRef(FormInputComponent);
