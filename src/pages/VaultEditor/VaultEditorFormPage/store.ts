import { createContext } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { IEditedVaultDescription } from "types";

interface IVaultEditorFormContext {
  committeeMembersFieldArray: UseFieldArrayReturn<IEditedVaultDescription, "committee.members">;
}

export const VaultEditorFormContext = createContext<IVaultEditorFormContext>(undefined as any);
