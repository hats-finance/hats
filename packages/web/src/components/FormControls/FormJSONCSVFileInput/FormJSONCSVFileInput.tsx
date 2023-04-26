import AddIcon from "@mui/icons-material/AddOutlined";
import FileIcon from "@mui/icons-material/DescriptionOutlined";
import csvToJson from "csvtojson";
import React, { forwardRef, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { parseIsDirty } from "../utils";
import { StyledFormJSONCSVFileInput } from "./styles";

type FormJSONCSVFileInputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileType: "JSON" | "CSV";
  colorable?: boolean;
  isDirty?: boolean;
  disabled?: boolean;
  small?: boolean;
  label?: string;
  error?: { message?: string; type: string };
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function FormJSONCSVFileInputComponent(
  {
    onChange,
    fileType,
    colorable = false,
    isDirty = false,
    label,
    error,
    disabled = false,
    small = false,
    ...props
  }: FormJSONCSVFileInputProps,
  ref
) {
  const { t } = useTranslation();
  const [, setChanged] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>();
  const localRef = useRef<HTMLInputElement>();

  const name = localRef.current?.name;
  const value = localRef.current?.value;
  const id = `file-input-${name}`;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const fr = new FileReader();

    fr.readAsText(e.target.files![0]);
    fr.onload = async function () {
      const acceptedFileTypes = fileType === "JSON" ? ["json"] : ["csv"];

      if (fr.result && localRef.current) {
        const extension = e.target.files![0].name.split(".").pop()?.toLowerCase();
        const isSuccess = extension && acceptedFileTypes.indexOf(extension) > -1;

        if (!isSuccess) {
          alert(t("invalid-file-type", { types: acceptedFileTypes?.join(", ") }));
          return;
        }

        if (fileType === "JSON") {
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
        } else if (fileType === "CSV") {
          const csvString = fr.result as string;

          let jsonString: string;

          try {
            const json = await csvToJson().fromString(csvString);
            jsonString = JSON.stringify(json);
          } catch (error) {
            setFileName(undefined);
            alert(t("invalid-csv-file"));
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
      }
    };
  };

  return (
    <StyledFormJSONCSVFileInput
      isSmall={small}
      isDirty={parseIsDirty(isDirty) && colorable}
      hasError={!!error && colorable}
      disabled={disabled}
      selected={!!fileName}
    >
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
        accept={fileType === "JSON" ? "application/JSON" : ".csv"}
        type="file"
        onChange={handleOnChange}
      />

      {fileName && value ? (
        <label htmlFor={id} className="icon-preview">
          <FileIcon className="icon" />
          {label && <label htmlFor={id}>{label}</label>}
          <p>{fileName}</p>
        </label>
      ) : (
        <label htmlFor={id} className="icon-add">
          <AddIcon className="icon" />
          {label && <label htmlFor={id}>{label}</label>}
          <p>{t(`${fileType}-file-placeholder`)}</p>
        </label>
      )}

      {error && <span className="error">{error.message}</span>}
    </StyledFormJSONCSVFileInput>
  );
}

export const FormJSONCSVFileInput = forwardRef(FormJSONCSVFileInputComponent);
