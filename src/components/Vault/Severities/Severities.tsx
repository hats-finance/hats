
import { useState } from "react";
import { IParentVault, ISeverity } from "../../../types/types";
import Severity from "./Severity";

interface IProps {
  severities: Array<ISeverity>
  parentVault: IParentVault
}

export default function Severities(props: IProps) {
  const [expandedSeverityIndex, setExpandedSeverityIndex] = useState();

  const severities = props.severities?.map((severity: ISeverity, index: number) => {
    return (
      <Severity
        key={index}
        severity={severity}
        parentVault={props.parentVault}
        severityIndex={index}
        expanded={expandedSeverityIndex === index}
        expandedSeverityIndex={expandedSeverityIndex}
        setExpandedSeverityIndex={setExpandedSeverityIndex} />
    )
  })

  return (
    <>
      {severities?.reverse()}
    </>
  )
}
