import { FieldValues, UseFormStateReturn } from "react-hook-form";
import { parseIsDirty } from "components";
import { getPath } from "utils/objects.utils";

export function getCustomIsDirty<T extends FieldValues>(
  name: string,
  dirtyFields: UseFormStateReturn<T>["dirtyFields"],
  defaultValues: UseFormStateReturn<T>["defaultValues"]
): boolean {
  const defaultValue = getPath(defaultValues, name);
  const nonEmptyDefaultValue = defaultValue !== undefined && defaultValue !== null && defaultValue !== "";

  return nonEmptyDefaultValue && parseIsDirty(getPath(dirtyFields, name));
}
