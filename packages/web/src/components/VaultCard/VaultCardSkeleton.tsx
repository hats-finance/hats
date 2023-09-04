import useWindowDimensions from "hooks/useWindowDimensions";
import ContentLoader from "react-content-loader";

export const VaultCardSkeleton = (props: any) => {
  const { width } = useWindowDimensions();

  return (
    <>
      {width > 800 ? (
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
      ) : (
        <ContentLoader
          speed={3}
          width={"100%"}
          height={"auto"}
          viewBox="0 0 580 275"
          backgroundColor="#353c56"
          foregroundColor="#23293d"
          {...props}
        >
          <circle cx="51" cy="45" r="42" />
          <rect x="102" y="4" rx="5" ry="5" width="174" height="23" />
          <rect x="102" y="43" rx="5" ry="5" width="250" height="5" />
          <rect x="102" y="57" rx="5" ry="5" width="250" height="5" />
          <rect x="67" y="125" rx="5" ry="5" width="110" height="15" />
          <rect x="80" y="146" rx="5" ry="5" width="85" height="6" />
          <rect x="21" y="241" rx="15" ry="15" width="249" height="27" />
          <rect x="102" y="69" rx="5" ry="5" width="250" height="5" />
          <rect x="10" y="106" rx="5" ry="5" width="560" height="2" />
          <rect x="391" y="126" rx="5" ry="5" width="110" height="15" />
          <rect x="404" y="147" rx="5" ry="5" width="85" height="6" />
          <rect x="10" y="170" rx="5" ry="5" width="560" height="2" />
          <rect x="285" y="117" rx="0" ry="0" width="2" height="46" />
          <rect x="231" y="185" rx="5" ry="5" width="110" height="15" />
          <rect x="244" y="206" rx="5" ry="5" width="85" height="6" />
          <rect x="10" y="225" rx="5" ry="5" width="560" height="2" />
          <rect x="307" y="242" rx="15" ry="15" width="249" height="27" />
        </ContentLoader>
      )}
    </>
  );
};
