import { Colors } from "../../../constants/constants";
import "./index.scss";

interface IProps {
  color: Colors
}

export default function Dot({ color }: IProps) {
  return (
    <span className="dot-wrapper" style={{ backgroundColor: color }} />
  )
}
