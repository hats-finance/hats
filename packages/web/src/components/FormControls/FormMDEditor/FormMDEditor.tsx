import MDEditor from "@uiw/react-md-editor";
import { forwardRef } from "react";
import { parseIsDirty } from "../utils";
import { StyledFormMDEditor } from "./styles";

type FormMDEditorProps = {
  colorable?: boolean;
  isDirty?: boolean;
  noMargin?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (data: string) => void;
  error?: { message?: string; type: string };
};

export const FormMDEditorComponent = (
  { colorable = false, isDirty = false, noMargin = false, disabled = false, value, onChange, error }: FormMDEditorProps,
  ref
) => {
  return (
    <StyledFormMDEditor
      hasError={!!error && colorable}
      isDirty={parseIsDirty(isDirty) && colorable}
      noMargin={noMargin}
      disabled={disabled}
    >
      <MDEditor
        value={value}
        previewOptions={{ disallowedElements: ["script", "iframe"] }}
        onChange={(value) => (disabled ? undefined : onChange(value ?? ""))}
      />
      {error && <span className="error">{error.message}</span>}
    </StyledFormMDEditor>
  );
};

export const FormMDEditor = forwardRef(FormMDEditorComponent);
