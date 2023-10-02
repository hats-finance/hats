import AddIcon from "@mui/icons-material/Add";
import { Button } from "components";
import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import { useContext } from "react";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IEditedVaultDescription } from "types";
import { getPath } from "utils/objects.utils";
import { VaultEditorFormContext } from "../../../store";
import { WhitelistedAddressForm } from "./WhitelistedAddressForm/WhitelistedAddressForm";
import { StyledWhitelistedAddressesList } from "./styles";

export const WhitelistedAddressesList = () => {
  const { t } = useTranslation();
  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const {
    control,
    formState: { errors },
  } = useEnhancedFormContext<IEditedVaultDescription>();

  const {
    fields: whitelistedAddresses,
    append: appendWhitelistedAddress,
    remove: removeWhitelistedAddress,
  } = useFieldArray({ control, name: `project-metadata.whitelist` });

  return (
    <StyledWhitelistedAddressesList>
      <div className="whitelistedAddresses">
        {whitelistedAddresses.map((whitelistedAddress, emailIndex) => {
          return <WhitelistedAddressForm key={whitelistedAddress.id} index={emailIndex} remove={removeWhitelistedAddress} />;
        })}

        {getPath(errors, "project-metadata.whitelist") && (
          <p className="field-error">{getPath(errors, "project-metadata.whitelist")?.message}</p>
        )}

        {!allFormDisabled && (
          <Button className="mt-1" styleType="invisible" onClick={() => appendWhitelistedAddress({ address: "" })}>
            <AddIcon className="mr-2" />
            <span>{t("VaultEditor.vault-details.newWhitelistedAddress")}</span>
          </Button>
        )}
      </div>
    </StyledWhitelistedAddressesList>
  );
};
