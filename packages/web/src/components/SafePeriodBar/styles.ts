import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledSafePeriodBar = styled.div<{ isSafetyPeriod: boolean }>(
  ({ isSafetyPeriod }) => css`
    background-color: ${isSafetyPeriod ? "var(--yellow)" : "var(--blue)"};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${getSpacing(2)};
    padding: ${getSpacing(2.5)};

    .info {
      text-transform: uppercase;
      font-weight: 700;
      color: ${isSafetyPeriod ? "var(--dark-blue)" : "var(--white)"};
    }

    .icon {
      color: ${isSafetyPeriod ? "var(--dark-blue)" : "var(--turquoise)"};
      font-size: var(--medium);
    }
  `
);
