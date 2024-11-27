import AddIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as FilesService from "../../../utils/filesService.api";
import { parseIsDirty } from "../utils";
import { StyledFormSupportFilesInput } from "./styles";
import { supportedExtensions } from "./supportedExtensions";

export type ISavedFile = {
  name: string;
  ipfsHash: string;
};

type FormSupportFilesInputProps = {
  colorable?: boolean;
  isDirty?: boolean;
  value: ISavedFile[];
  label?: string;
  name: string;
  onChange: (data: ISavedFile[]) => void;
  error?: { message?: string; type: string };
  uploadTo?: "db" | "ipfs";
  noFilesAttachedInfo?: boolean;
};

export const FormSupportFilesInputComponent = (
  {
    colorable = false,
    isDirty = false,
    name,
    onChange,
    label,
    error,
    value,
    uploadTo = "db",
    noFilesAttachedInfo,
  }: FormSupportFilesInputProps,
  ref
) => {
  const { t } = useTranslation();

  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) return;
      setIsUploadingFiles(true);

      const acceptedFileTypes = supportedExtensions;

      const filesToUploadPromises: Promise<ISavedFile>[] = [];

      // Iterate over all the selected files
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const extension = file.name.split(".").pop()?.toLowerCase();
        const isSuccess = extension && acceptedFileTypes.indexOf(extension) > -1;

        if (!isSuccess) {
          setIsUploadingFiles(false);
          return alert(t("invalid-file-type"));
        }

        filesToUploadPromises.push(FilesService.uploadFileToDB(file, uploadTo === "ipfs"));
      }

      const uploadedFiles = await Promise.all(filesToUploadPromises);
      onChange([...value, ...uploadedFiles]);
      setIsUploadingFiles(false);
    } catch (error) {
      setIsUploadingFiles(false);
    }
  };

  const handleRemoveFile = (idx: number) => {
    const newFiles = [...value];
    newFiles.splice(idx, 1);
    onChange(newFiles);
  };

  return (
    <StyledFormSupportFilesInput isDirty={parseIsDirty(isDirty) && colorable} hasError={!!error && colorable}>
      <input id={name} className="file-input" accept=".ts,.sol" type="file" multiple onChange={handleOnChange} />

      <label htmlFor={name} className="icon-add">
        <AddIcon className="icon" />
        <p>{isUploadingFiles ? `${t("uploadingFiles")}...` : label ?? ""}</p>
      </label>

      {!noFilesAttachedInfo && (
        <div className="files-attached-container">
          <p>{t("filesAttached")}:</p>
          <ul className="files">
            {value?.map((file, idx) => (
              <li key={idx}>
                <CloseIcon className="remove-icon" onClick={() => handleRemoveFile(idx)} />
                <p>{file.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <span className="error">{error.message}</span>}
    </StyledFormSupportFilesInput>
  );
};

export const FormSupportFilesInput = forwardRef(FormSupportFilesInputComponent);
