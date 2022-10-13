import React, { ChangeEvent, forwardRef, useRef, useState } from "react";
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
  const name = localRef.current?.name;
  const value = localRef.current?.value;
  const id = `icon-editor-${name}`;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChanged(true);
    const fr = new FileReader();
    fr.readAsArrayBuffer(e.target.files![0])
    fr.onload = function () {
      // you can keep blob or save blob to another position
      if (fr.result && localRef.current) {
        const blob = new Blob([fr.result])
        const url = URL.createObjectURL(blob);
        localRef.current.value = url;

        onChange({
          ...e,
          target: {
            ...localRef.current,
            value: url,
            name: localRef.current.name,
          },
        })
      }
    }
  }

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

        <input
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