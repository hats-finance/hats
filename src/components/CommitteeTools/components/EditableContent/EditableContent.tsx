import { forwardRef } from "react";
import "./index.scss";
import PasteIcon from "assets/icons/paste.icon.svg";
import CopyIcon from "assets/icons/copy.icon.svg";

function EditableContent(
  {
    pastable,
    copyable,
    ...props
  }: {
    pastable?: boolean;
    copyable?: boolean;
    placeholder?: string;
  },
  ref
) {
  const extraIcons = pastable || copyable;

  return (
    <div className="pastable-content">
      <textarea ref={ref} {...props} className="pastable-content__textarea" />
      {extraIcons && (
        <div className="pastable-content__extra-icons">
          {pastable && (
            <img
              alt="paste"
              src={PasteIcon}
              onClick={() => {
                navigator.clipboard.readText().then((text) => {
                  ref.current!.value = text;
                });
              }}
            />
          )}
          {copyable && (
            <img
              alt="copy"
              src={CopyIcon}
              onClick={() => {
                navigator.clipboard.writeText(ref.current!.value);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default forwardRef(EditableContent);
