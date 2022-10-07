export type BreakpointsDefinition = {
  mobile: string;
  smallScreen: string;
};

export const breakpointsDefinition: BreakpointsDefinition = {
  smallScreen: '100rem', // 1600px
  mobile: '68.75rem', // 1100px
};

export const mediaQuery: BreakpointsDefinition = {
  smallScreen: `only screen and (max-width: ${breakpointsDefinition.smallScreen})`,
  mobile: `only screen and (max-width: ${breakpointsDefinition.mobile})`,
};