import ContentLoader from "react-content-loader";

export const VaultCardSkeleton = (props: any) => (
  <ContentLoader
    speed={3}
    width="100%"
    height="auto"
    viewBox="0 0 580 105"
    backgroundColor="#353c56"
    foregroundColor="#23293d"
    {...props}
  >
    <circle cx="51" cy="30" r="28" />
    <rect x="102" y="4" rx="5" ry="5" width="134" height="23" />
    <rect x="102" y="38" rx="3" ry="3" width="250" height="5" />
    <rect x="102" y="52" rx="3" ry="3" width="250" height="5" />
    {/* <rect x="102" y="69" rx="5" ry="5" width="250" height="5" /> */}
    <rect x="389" y="19" rx="5" ry="5" width="80" height="15" />
    <rect x="402" y="40" rx="5" ry="5" width="50" height="6" />
    <rect x="493" y="19" rx="5" ry="5" width="80" height="15" />
    <rect x="506" y="40" rx="5" ry="5" width="50" height="6" />
    <rect x="9" y="78" rx="5" ry="5" width="84" height="15" />
    <rect x="473" y="74" rx="12" ry="12" width="103" height="23" />
    <rect x="360" y="74" rx="12" ry="12" width="103" height="23" />
    <rect x="246" y="74" rx="12" ry="12" width="103" height="23" />
  </ContentLoader>
);
