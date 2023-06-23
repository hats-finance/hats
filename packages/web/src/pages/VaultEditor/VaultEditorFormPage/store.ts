import { createContext } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { IEditedVaultDescription, IVault } from "types";

export interface IVaultEditorFormContext {
  editSessionId: string | undefined;
  committeeMembersFieldArray: UseFieldArrayReturn<IEditedVaultDescription, "committee.members">;
  saveEditSessionData: () => Promise<void>;
  isVaultCreated: boolean;
  isEditingExistingVault: boolean;
  existingVault: IVault | undefined;
  allFormDisabled: boolean;
  isAdvancedMode: boolean;
}

export const VaultEditorFormContext = createContext<IVaultEditorFormContext>(undefined as any);
