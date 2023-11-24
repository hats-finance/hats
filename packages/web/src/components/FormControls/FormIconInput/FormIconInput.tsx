import AddIcon from "assets/icons/add.icon.svg";
import DOMPurify from "dompurify";
import React, { forwardRef, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Resizer from "react-image-file-resizer";
import { ipfsTransformUri } from "utils";
import { parseIsDirty } from "../utils";
import { StyledFormIconInput } from "./styles";

const MAX_SIZE_ICON = 50000;
const MAX_SIZE_IMAGE = 100000;

interface FormIconInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorable?: boolean;
  isDirty?: boolean;
  disabled?: boolean;
  type?: "icon" | "image";
  label?: string;
  error?: { message?: string; type: string };
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

  const resizeFile = (blob: Blob, imageType: "PNG" | "JPG") =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(blob, 300, 300, imageType, 80, 0, (uri) => resolve(uri), "blob");
    });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const fr = new FileReader();

    fr.readAsArrayBuffer(e.target.files![0]);
    fr.onload = async function () {
      // const fileTypes = type === "icon" ? ["svg"] : ["jpg", "jpeg", "png", "gif", "svg"];

      if (fr.result && localRef.current) {
        const extension = e.target.files![0].name.split(".").pop()?.toLowerCase();
        // const isSuccess = extension;

        // if (!isSuccess) {
        //   alert(t("invalid-image-type", { types: fileTypes.join(", ") }));
        //   return;
        // }

        const isSvg = extension === "svg";
        let blob: Blob;

        if (isSvg) {
          const enc = new TextEncoder();
          const dec = new TextDecoder("utf-8");
          const arr = new Uint8Array(fr.result as ArrayBuffer);
          const svgString = dec.decode(arr);
          const sanitizedSvg = DOMPurify.sanitize(svgString);
          const sanitizedSvgArray = enc.encode(sanitizedSvg);
          blob = new Blob([sanitizedSvgArray], { type: "image/svg+xml" });
        } else {
          blob = new Blob([fr.result]);
          blob = (await resizeFile(blob, type === "image" ? "JPG" : extension === "png" ? "PNG" : "JPG")) as Blob;
        }

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

      <input
        disabled={disabled}
        id={id}
        className="file-input"
        accept={type === "icon" ? ".svg" : "image/*"}
        type="file"
        onChange={handleOnChange}
      />

      {value ? (
        <label htmlFor={id} className="icon-preview">
          <img src={ipfsTransformUri(value, { isPinned: false })} alt="thumbnail" />
        </label>
      ) : (
        <label htmlFor={id} className="icon-add">
          <img src={AddIcon} alt="add" />
        </label>
      )}

      <div className="info">
        {value ? (
          <>
            {label && <label htmlFor={id}>{label}</label>}
            <p>&nbsp;</p>
          </>
        ) : (
          <>
            {label && <label htmlFor={id}>{label}</label>}
            <p>{getPlaceholder()}</p>
          </>
        )}
      </div>

      {/* {error && <span className="error">{error.message}</span>} */}
    </StyledFormIconInput>
  );
}

export const FormIconInput = forwardRef(FormIconInputComponent);
