import { allowedElementsMarkdown } from "@hats.finance/shared";
import MDEditor, { PreviewType } from "@uiw/react-md-editor";
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
  initialState?: PreviewType;
};

export const FormMDEditorComponent = (
  {
    colorable = false,
    isDirty = false,
    noMargin = false,
    disabled = false,
    value,
    onChange,
    error,
    initialState = "live",
  }: FormMDEditorProps,
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
        previewOptions={{ allowedElements: allowedElementsMarkdown }}
        onChange={(value) => (disabled ? undefined : onChange(value ?? ""))}
        minHeight={200}
        height={450}
        preview={initialState}
      />
      {error && <span className="error">{error.message}</span>}
    </StyledFormMDEditor>
  );
};

export const FormMDEditor = forwardRef(FormMDEditorComponent);
