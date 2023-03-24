import React, { forwardRef, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AddIcon from "assets/icons/add.icon.svg";
import { StyledFormJSONFileInput } from "./styles";
import { parseIsDirty } from "../utils";

interface FormJSONFileInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorable?: boolean;
  isDirty?: boolean;
  disabled?: boolean;
  label?: string;
  error?: { message?: string; type: string };
}

function FormJSONFileInputComponent(
  { onChange, colorable = false, isDirty = false, label, error, disabled = false, ...props }: FormJSONFileInputProps,
  ref
) {
  const { t } = useTranslation();
  const [, setChanged] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>();
  const localRef = useRef<HTMLInputElement>();

  const name = localRef.current?.name;
  const value = localRef.current?.value;
  const id = `filejson-input-${name}`;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const fr = new FileReader();

    fr.readAsText(e.target.files![0]);
    fr.onload = async function () {
      const acceptedFileTypes = ["json"];

      if (fr.result && localRef.current) {
        const extension = e.target.files![0].name.split(".").pop()?.toLowerCase();
        const isSuccess = extension && acceptedFileTypes.indexOf(extension) > -1;

        if (!isSuccess) {
          alert(t("invalid-file-type", { types: acceptedFileTypes?.join(", ") }));
          return;
        }

        const jsonString = fr.result as string;

        try {
          JSON.parse(jsonString);
        } catch (error) {
          setFileName(undefined);
          alert(t("invalid-json-file"));
          return;
        }

        localRef.current.value = jsonString;

        setFileName(e.target.files![0].name);
        setChanged((prev) => !prev);
        onChange({
          ...e,
          target: {
            ...localRef.current,
            value: jsonString,
            name: localRef.current.name,
          },
        });
      }
    };
  };

  return (
    <StyledFormJSONFileInput isDirty={parseIsDirty(isDirty) && colorable} hasError={!!error && colorable} disabled={disabled}>
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

      <input disabled={disabled} id={id} className="file-input" accept="application/JSON" type="file" onChange={handleOnChange} />

      {fileName && value ? (
        <label htmlFor={id} className="icon-preview">
          {label && <label htmlFor={id}>{label}</label>}
          <p>{fileName}</p>
        </label>
      ) : (
        <label htmlFor={id} className="icon-add">
          <img src={AddIcon} alt="add" />
          {label && <label htmlFor={id}>{label}</label>}
          <p>{t("json-file-placeholder")}</p>
        </label>
      )}

      {error && <span className="error">{error.message}</span>}
    </StyledFormJSONFileInput>
  );
}

export const FormJSONFileInput = forwardRef(FormJSONFileInputComponent);
