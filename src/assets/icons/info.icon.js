export default function InfoIcon(props) {
  return <svg width={props.width ?? "24"} height={props.height ?? "24"} viewBox="0 0 24 24" fill={props.fill ?? "none"} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11.5" stroke="#9BC8CA" />
    <rect x="11" y="10" width="2" height="8" fill="#9BC8CA" />
    <rect x="11" y="6" width="2" height="2" fill="#9BC8CA" />
  </svg>
}
