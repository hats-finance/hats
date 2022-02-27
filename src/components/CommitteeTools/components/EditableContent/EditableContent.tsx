import { forwardRef, useRef } from "react";
import "./index.scss";
import PasteIcon from "assets/icons/paste.icon.svg";
import CopyIcon from "assets/icons/copy.icon.svg";
import RemoveIcon from "assets/icons/delete.icon.svg";
import classNames from "classnames";

type Props = {
  pastable?: boolean;
  copyable?: boolean;
  removable?: boolean;
  textInput?: boolean
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
& React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>

function EditableContent(
  {
    pastable,
    copyable,
    removable,
    textInput,
    ...props
  }: Props,
  ref
) {
  const localRef = useRef<HTMLTextAreaElement | HTMLInputElement>();
  const extraIcons = pastable || copyable || removable;
  return (
    <div className="pastable-content">
      {textInput ? (
        <input
          type="text"
          ref={ref || localRef} {...props} className="pastable-content__input"
        />
        ) : (
        <textarea
          ref={ref || localRef} {...props} className="pastable-content__textarea"
        />
      )}
      {extraIcons && (
        <div className={classNames("pastable-content__extra-icons", {
          "pastable-content__extra-icons--input": textInput
        })}>
          {pastable && (
            <img
              alt="paste"
              src={PasteIcon}
              onClick={() => {
                navigator.clipboard.readText().then((text) => {
                  if (ref)
                    ref.current!.value = text
                  else
                    localRef.current!.value = text
                });
              }}
            />
          )}
          {copyable && (
            <img
              alt="copy"
              src={CopyIcon}
              onClick={() => {
                navigator.clipboard.writeText(ref ? ref.current!.value : localRef.current!.value);
              }}
            />
          )}
          {removable && (
            <img
              alt="remove"
              src={RemoveIcon}
              onClick={() => {
                if (ref) ref.current!.value = ''
                else localRef.current!.value = ''
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default forwardRef(EditableContent);
