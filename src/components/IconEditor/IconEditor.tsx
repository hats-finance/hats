import React, { forwardRef, useRef, useState } from "react";
import classNames from "classnames";
import AddIcon from "assets/icons/add.icon.svg";
import "./IconEditor.scss";
import { ipfsTransformUri } from "utils";
import { useTranslation } from "react-i18next";

interface IconEditorProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorable?: boolean;
}

function IconEditorComponent({ onChange, colorable, ...props }: IconEditorProps, ref) {
  const { t } = useTranslation();
  const [changed, setChanged] = useState(false);
  const localRef = useRef<HTMLInputElement>();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChanged(true);
    onChange(e);
    console.log(e.target.files);

  }
  const value = localRef.current?.value;

  const id = `icon-editor-x`;
  return (
    <>
      <div
        className={classNames("icon-input", {
          "icon-input--changed": changed && colorable,
        })}>
        <input type="hidden" {...props} ref={(e) => {
          ref(e);
          (localRef as any).current = e;
        }} />

        < input
          // ref={(e) => {
          //   ref(e);
          //   if (e) {
          //     localRef.current = e;
          //   }
          // }}
          id={id}
          className="hide-file-input"
          accept="image/*"
          type="file"
          onChange={handleOnChange}

        />
        {
          value ? (
            <label htmlFor={id} className="preview" >
              <img src={ipfsTransformUri(value)} alt="Thumb" />
            </label>
          ) : (
            <label htmlFor={id} className="add-icon">
              <img src={AddIcon} width={30} height={30} alt="Thumb" />
              <p>{t("VaultEditor.img-placeholder")}</p>
            </label>
          )}
      </div>
    </>
  );
};

export const IconEditor = forwardRef(IconEditorComponent);