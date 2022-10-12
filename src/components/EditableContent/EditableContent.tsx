import { ChangeEvent, forwardRef, useRef, useState } from "react";
import classNames from "classnames";
import PasteIcon from "assets/icons/paste.icon.svg";
import CopyIcon from "assets/icons/copy.icon.svg";
import RemoveIcon from "assets/icons/delete.icon.svg";
import "./index.scss";

type Props = {
  pastable?: boolean;
  copyable?: boolean;
  removable?: boolean;
  colorable?: boolean;
  textInput?: boolean;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

function EditableContentComponent({ pastable, copyable, removable, textInput, colorable, ...props }: Props, ref) {
  const localRef = useRef<HTMLTextAreaElement | HTMLInputElement>();
  const extraIcons = pastable || copyable || removable;
  const [changed, setChanged] = useState(false);

  const refToUse = ref || localRef;

  const handleOnChange = (e: ChangeEvent<any>) => {
    setChanged(true);
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

  return (
    <div className="pastable-content">
      {textInput ? (
        <input
          {...props}
          type="text"
          ref={refToUse}
          className={classNames("pastable-content__input", {
            "pastable-content__input--changed": changed && colorable,
          })}
          onChange={handleOnChange}
        />
      ) : (
        <textarea
          {...props}
          ref={refToUse}
          className={classNames("pastable-content__textarea", {
            "pastable-content__textarea--changed": changed && colorable,
          })}
          onChange={handleOnChange}
        />
      )}
      {extraIcons && (
        <div
          className={classNames("pastable-content__extra-icons", {
            "pastable-content__extra-icons--input": textInput,
          })}>
          {pastable && <img alt="paste" src={PasteIcon} onClick={handleOnPaste} />}
          {copyable && <img alt="copy" src={CopyIcon} onClick={handleOnCopy} />}
          {removable && <img alt="remove" src={RemoveIcon} onClick={handleOnClear} />}
        </div>
      )}
    </div>
  );
}

export const EditableContent = forwardRef(EditableContentComponent);
