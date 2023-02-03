import { createContext } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { IEditedVaultDescription } from "types";

interface IVaultEditorFormContext {
  editSessionId: string | undefined;
  committeeMembersFieldArray: UseFieldArrayReturn<IEditedVaultDescription, "committee.members">;
  saveEditSessionData: () => Promise<void>;
}

export const VaultEditorFormContext = createContext<IVaultEditorFormContext>(undefined as any);
