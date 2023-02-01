export const parseIsDirty = (isDirty: boolean | boolean[]) => {
  if (Array.isArray(isDirty)) {
    return isDirty.some((item) => item);
  }
  return isDirty;
};
