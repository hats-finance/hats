import { forwardRef } from "react";
import { StyledFormPgpPublicKeyInput } from "./styles";
import { useTranslation } from "react-i18next";
import { parseIsDirty } from "../utils";
import useModal from "hooks/useModal";
import { PgpPublicKeyInputModal } from "./PgpPublicKeyInputModal";
import { ErrorMessage } from "../ErrorMessage";

interface FormPgpPublicKeyInputProps {
  label?: string;
  name?: string;
  placeholder?: string;
  colorable?: boolean;
  noMargin?: boolean;
  isDirty?: boolean;
  value: string;
  notAllowedKeys?: string[];
  onChange: (data: string) => void;
  error?: { message: string; type: string };
}

export function FormPgpPublicKeyInputComponent(
  {
    value,
    onChange,
    name,
    colorable = false,
    isDirty = false,
    noMargin = false,
    notAllowedKeys = [],
    error,
    placeholder,
    label,
  }: FormPgpPublicKeyInputProps,
  ref
) {
  const { t } = useTranslation();
  const { isShowing: isShowingPgpKeyInput, show: showPgpKeyInput, hide: hidePgpKeyInput } = useModal();

  const getPgpKeyResumed = (pgpKey: string) => `${pgpKey.split("\n\n")[1]?.slice(0, 50)}...`;

  return (
    <StyledFormPgpPublicKeyInput hasError={!!error && colorable} isDirty={parseIsDirty(isDirty) && colorable} noMargin={noMargin}>
      <div className="select-button" onClick={showPgpKeyInput}>
        <label>{label ?? t("pgpPublicKey")}</label>
        {value ? (
          <p className="value">{getPgpKeyResumed(value)}</p>
        ) : (
          <p className="placeholder">{placeholder ?? t("addPgpPublicKey")}</p>
        )}
      </div>

      {error && <ErrorMessage error={error} />}

      <PgpPublicKeyInputModal
        key={name}
        isShowing={isShowingPgpKeyInput}
        onHide={hidePgpKeyInput}
        onPgpKeySelected={onChange}
        notAllowedKeys={notAllowedKeys}
        ref={ref}
      />
    </StyledFormPgpPublicKeyInput>
  );
}

export const FormPgpPublicKeyInput = forwardRef(FormPgpPublicKeyInputComponent);
