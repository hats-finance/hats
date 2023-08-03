import styled, { css } from "styled-components";
import { getPrimaryGradient, getSpacing } from "styles";
import { SafePeriodBarProps } from "./SafePeriodBar";

export const StyledSafePeriodBar = styled.div<{ isSafetyPeriod: boolean; type: SafePeriodBarProps["type"] }>(
  ({ isSafetyPeriod, type }) => css`
    background: ${isSafetyPeriod ? "var(--warning-yellow)" : "var(--background-4)"};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${getSpacing(2)};
    padding: ${getSpacing(2.5)};
    border-bottom: 1px solid var(--primary-light);

    .info {
      text-transform: uppercase;
      font-weight: 700;
      color: ${isSafetyPeriod ? "var(--background-1)" : "var(--white)"};
    }

    .icon {
      color: ${isSafetyPeriod ? "var(--background-1)" : "var(--white)"};
      font-size: var(--medium);
    }

    ${type === "banner" &&
    css`
      padding: ${getSpacing(1)};
      font-size: var(--xxsmall);
      background: ${isSafetyPeriod ? "var(--warning-yellow)" : getPrimaryGradient()};

      .icon {
        font-size: var(--moderate);
      }

      .info {
        font-weight: 500;
      }
    `}
  `
);
