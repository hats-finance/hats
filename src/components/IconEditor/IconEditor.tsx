import React, { forwardRef, useEffect, useState } from "react";
import classNames from "classnames";
import AddIcon from "assets/icons/add.icon.svg";
import "./IconEditor.scss";
import { ipfsTransformUri } from "utils";
import { useTranslation } from "react-i18next";
import { RefCallBack } from "react-hook-form";

interface IconEditorProps {
  //ref: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorable?: boolean;
}

function IconEditorComponent({ onChange, colorable, ...props }: IconEditorProps, ref) {
  const { t } = useTranslation();
  const [changed, setChanged] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChanged(true);
    onChange(e);
  }

  const value = ref?.current?.value
  const name = ref?.current?.name
  return (
    <>
      <div
        className={classNames("icon-input", {
          "icon-input--changed": changed && colorable,
        })}>
        <input
          ref={ref}
          // id={`icon-input-${name}`}
          className="hide-file-input"
          accept="image/*"
          type="file"
          onChange={handleOnChange}
          {...props}
        />
        {value ? (
          <label htmlFor={`icon-input-${name}`} className="preview">
            <img src={ipfsTransformUri(value)} alt="Thumb" />
          </label>
        ) : (
          <label htmlFor={`icon-input-${name}`} className="add-icon">
            <img src={AddIcon} width={30} height={30} alt="Thumb" />
            <p>{t("VaultEditor.img-placeholder")}</p>
          </label>
        )}
      </div>
    </>
  );
};

export const IconEditor = forwardRef(IconEditorComponent);