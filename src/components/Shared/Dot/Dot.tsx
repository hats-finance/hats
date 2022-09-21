import classNames from "classnames";
import { Colors } from "../../../constants/constants";
import "./index.scss";

interface IProps {
  color: Colors;
  className?: string;
}

export default function Dot({ color, className }: IProps) {
  return (
    <span className={classNames("dot-wrapper", className)} style={{ backgroundColor: color }} />
  )
}
