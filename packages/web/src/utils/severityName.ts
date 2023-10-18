export const parseSeverityName = (severityName: string) => {
  return severityName.toLowerCase().replace("severity", "").trim();
};
