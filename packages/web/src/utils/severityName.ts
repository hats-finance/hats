export const parseSeverityName = (severityName: string) => {
  return severityName.replace("severity", "").trim().toLowerCase();
};
