import { useState } from "react";
import { IVault, IVulnerabilitySeverity } from "types";
import Severity from "./Severity";

interface IProps {
  severities: Array<IVulnerabilitySeverity>;
  vault: IVault;
  preview: boolean;
}

export default function Severities(props: IProps) {
  return null;
  // const [expandedSeverityIndex, setExpandedSeverityIndex] = useState();
  // const severities = props.severities?.map((severity: IVulnerabilitySeverity, index: number) => {
  //   return (
  //     <Severity
  //       key={index}
  //       preview={props.preview}
  //       severity={severity}
  //       vault={props.vault}
  //       severityIndex={index}
  //       expanded={expandedSeverityIndex === index}
  //       expandedSeverityIndex={expandedSeverityIndex}
  //       setExpandedSeverityIndex={setExpandedSeverityIndex}
  //     />
  //   );
  // });

  // return <>{severities?.reverse()}</>;
}
