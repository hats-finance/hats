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
  disabled?: boolean;
  type?: "icon" | "image";
  label?: string;
  error?: { message: string; type: string };
}

function FormIconInputComponent(
  { onChange, colorable = false, isDirty = false, label, error, type = "icon", disabled = false, ...props }: FormIconInputProps,
  ref
) {
  const { t } = useTranslation();
  const [, setChanged] = useState(false);
  const localRef = useRef<HTMLInputElement>();

  const name = localRef.current?.name;
  const value = localRef.current?.value;
  const id = `icon-input-${name}`;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const fr = new FileReader();

    fr.readAsArrayBuffer(e.target.files![0]);
    fr.onload = async function () {
      const fileTypes = type === "icon" ? ["svg"] : ["jpg", "jpeg", "png", "gif", "svg"];

      if (fr.result && localRef.current) {
        const extension = e.target.files![0].name.split(".").pop()?.toLowerCase();
        const isSuccess = extension && fileTypes.indexOf(extension) > -1;

        if (!isSuccess) {
          alert(t("invalid-image-type", { types: fileTypes.join(", ") }));
          return;
        }

        const isSvg = extension === "svg";
        const blob = isSvg ? new Blob([fr.result], { type: "image/svg+xml" }) : new Blob([fr.result]);
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
      return t("icon-placeholder");
    } else {
      return t("img-placeholder");
    }
  };

  return (
    <StyledFormIconInput isDirty={parseIsDirty(isDirty) && colorable} hasError={!!error && colorable} disabled={disabled}>
      <input
        {...props}
        disabled={disabled}
        type="hidden"
        ref={(e) => {
          if (ref && typeof ref === "function") ref(e);
          (localRef as any).current = e;
          setChanged((prev) => !prev);
        }}
      />

      <input disabled={disabled} id={id} className="file-input" accept="image/*" type="file" onChange={handleOnChange} />

      {value ? (
        <label htmlFor={id} className="icon-preview">
          {label && <label htmlFor={id}>{label}</label>}
          <img src={ipfsTransformUri(value, { isPinned: false })} alt="thumbnail" />
        </label>
      ) : (
        <label htmlFor={id} className="icon-add">
          <img src={AddIcon} alt="add" />
          {label && <label htmlFor={id}>{label}</label>}
          <p>{getPlaceholder()}</p>
        </label>
      )}

      {error && <span className="error">{error.message}</span>}
    </StyledFormIconInput>
  );
}

export const FormIconInput = forwardRef(FormIconInputComponent);
