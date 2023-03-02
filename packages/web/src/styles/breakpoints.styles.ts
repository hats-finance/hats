import { css } from "styled-components";

export type BreakpointsDefinition = {
  smallMobile: string;
  mobile: string;
  smallScreen: string;
};

export const breakpointsDefinition: BreakpointsDefinition = {
  smallScreen: "100rem", // 1600px
  mobile: "68.75rem", // 1100px
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
