import ContentLoader from "react-content-loader";

export const VaultCardSkeleton = (props: any) => (
  <ContentLoader
    speed={3}
    width="100%"
    height="auto"
    viewBox="0 0 580 120"
    backgroundColor="#353c56"
    foregroundColor="#23293d"
    {...props}
  >
    <circle cx="51" cy="45" r="42" />
    <rect x="102" y="4" rx="5" ry="5" width="134" height="23" />
    <rect x="102" y="43" rx="5" ry="5" width="250" height="5" />
    <rect x="102" y="57" rx="5" ry="5" width="250" height="5" />
    <rect x="389" y="19" rx="5" ry="5" width="80" height="15" />
    <rect x="402" y="40" rx="5" ry="5" width="50" height="6" />
    <rect x="493" y="19" rx="5" ry="5" width="80" height="15" />
    <rect x="506" y="40" rx="5" ry="5" width="50" height="6" />
    <rect x="9" y="97" rx="5" ry="5" width="84" height="15" />
    <rect x="473" y="92" rx="12" ry="12" width="103" height="23" />
    <rect x="360" y="92" rx="12" ry="12" width="103" height="23" />
    <rect x="246" y="92" rx="12" ry="12" width="103" height="23" />
    <rect x="102" y="69" rx="5" ry="5" width="250" height="5" />
  </ContentLoader>
);
