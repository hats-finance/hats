import { forwardRef, useRef, useState } from "react";
import "./index.scss";
import PasteIcon from "assets/icons/paste.icon.svg";
import CopyIcon from "assets/icons/copy.icon.svg";
import RemoveIcon from "assets/icons/delete.icon.svg";
import classNames from "classnames";

type Props = {
  pastable?: boolean;
  copyable?: boolean;
  removable?: boolean;
  colorable?: boolean;
  textInput?: boolean
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
& React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>

function EditableContent(
  {
    pastable,
    copyable,
    removable,
    textInput,
    colorable,
    ...props
  }: Props,
  ref
) {
  const localRef = useRef<HTMLTextAreaElement | HTMLInputElement>();
  const extraIcons = pastable || copyable || removable;
  const [changed, setChanged] = useState(false)

  return (
    <div className="pastable-content">
      {textInput ? (
        <input
          type="text"
          ref={ref || localRef} {...props} className={classNames("pastable-content__input", {
            "pastable-content__input--changed": changed && colorable
          })}
          onChange={(e) => {
            setChanged(true)
            if (props.onChange) {
              props.onChange(e)
            }
          }}
        />
        ) : (
        <textarea
          ref={ref || localRef} {...props} className={classNames("pastable-content__textarea", {
            "pastable-content__textarea--changed": changed && colorable
          })}
          onChange={(e) => {
            setChanged(true)
            if (props.onChange) {
              props.onChange(e)
            }
          }}
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
