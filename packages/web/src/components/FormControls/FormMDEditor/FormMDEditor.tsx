import MDEditor from "@uiw/react-md-editor";
import { parseIsDirty } from "../utils";
import { StyledFormMDEditor } from "./styles";

interface FormMDEditorProps {
  colorable?: boolean;
  isDirty?: boolean;
  value: string;
  onChange: (data: string) => void;
  error?: { message?: string; type: string };
}

export const FormMDEditor = ({ colorable = false, isDirty = false, value, onChange, error }: FormMDEditorProps) => {
  return (
    <StyledFormMDEditor hasError={!!error && colorable} isDirty={parseIsDirty(isDirty) && colorable}>
      <MDEditor
        value={value}
        previewOptions={{ disallowedElements: ["script", "iframe"] }}
        onChange={(value) => onChange(value ?? "")}
      />
      {error && <span className="error">{error.message}</span>}
    </StyledFormMDEditor>
  );
};
