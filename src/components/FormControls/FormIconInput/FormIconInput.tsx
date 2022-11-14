import React, { forwardRef, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ipfsTransformUri } from "utils";
import AddIcon from "assets/icons/add.icon.svg";
import { StyledFormIconInput } from "./styles";
import { parseIsDirty } from "../utils";

const MAX_SIZE_ICON = 50000;
const MAX_SIZE_IMAGE = 2000000;

interface FormIconInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorable?: boolean;
  isDirty?: boolean;
  type?: "icon" | "image";
  label?: string;
  error?: { message: string; type: string };
}

function FormIconInputComponent(
  { onChange, colorable = false, isDirty = false, label, error, type = "icon", ...props }: FormIconInputProps,
  ref
) {
  const { t } = useTranslation();
  const [, setChanged] = useState(false);
  const localRef = useRef<HTMLInputElement>();

  const name = localRef.current?.name;
  const value = localRef.current?.value;
  const id = `icon-input-${name}`;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fr = new FileReader();

    fr.readAsArrayBuffer(e.target.files![0]);
    fr.onload = function () {
      if (fr.result && localRef.current) {
        const blob = new Blob([fr.result]);
        const url = URL.createObjectURL(blob);

        const validSize = verifyBlobSize(blob.size);
        if (!validSize) return;

        localRef.current.value = url;

        setChanged((prev) => !prev);
        onChange({
          ...e,
          target: {
            ...localRef.current,
            value: url,
            name: localRef.current.name,
          },
        });
      }
    };
  };

  const verifyBlobSize = (size: number) => {
    if ((type === "icon" && size > MAX_SIZE_ICON) || (type === "image" && size > MAX_SIZE_IMAGE)) {
      alert(t("fileTooBig"));
      return false;
    }

    return true;
  };

  const getPlaceholder = () => {
    if (type === "icon") {
      return t("VaultEditor.icon-placeholder");
    } else {
      return t("VaultEditor.img-placeholder");
    }
  };

  return (
    <StyledFormIconInput isDirty={parseIsDirty(isDirty) && colorable} hasError={!!error && colorable}>
      <input
        {...props}
        type="hidden"
        ref={(e) => {
          ref(e);
          (localRef as any).current = e;
          setChanged((prev) => !prev);
        }}
      />

      {label && <label>{label}</label>}
      <input id={id} className="file-input" accept="image/*" type="file" onChange={handleOnChange} />

      {value ? (
        <label htmlFor={id} className="icon-preview">
          <img src={ipfsTransformUri(value)} alt="thumbnail" />
        </label>
      ) : (
        <label htmlFor={id} className="icon-add">
          <img src={AddIcon} alt="add" />
          <p>{getPlaceholder()}</p>
        </label>
      )}

      {error && <span className="error">{error.message}</span>}
    </StyledFormIconInput>
  );
}

export const FormIconInput = forwardRef(FormIconInputComponent);
