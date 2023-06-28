import { css } from "styled-components";

export type BreakpointsDefinition = {
  smallMobile: string;
  mobile: string;
  mediumMobile: string;
  mediumScreen: string;
  smallScreen: string;
};

export const breakpointsDefinition: BreakpointsDefinition = {
  mediumScreen: "100rem", // 1600px
  smallScreen: "81.25rem", // 1300px
  mobile: "68.75rem", // 1100px
  mediumMobile: "50rem", // 800px
  smallMobile: "37.5rem", // 600px
};

export const responsiveUtilityClasses = css`
  .onlyDesktop {
    @media (max-width: ${breakpointsDefinition.mobile}) {
      display: none !important;
    }
  }

  .onlyMobile {
    @media (min-width: ${breakpointsDefinition.mobile}) {
      display: none !important;
    }
  }
`;
