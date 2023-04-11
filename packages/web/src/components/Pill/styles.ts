import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { PillProps } from "./Pill";

const getVarColor = (color: PillProps["color"]) => {
  switch (color) {
    case "red":
      return "var(--error-red)";
    case "blue":
      return "var(--turquoise)";
    case "yellow":
      return "var(--warning-yellow)";
  }
};

export const StyledPill = styled.div<{ transparent: boolean }>(
  ({ transparent }) => css`
    color: ${transparent ? "var(--white)" : "var(--turquoise)"};
    font-size: var(--xxsmall);
    text-transform: none;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: ${getSpacing(0.8)};
    background: ${transparent ? "transparent" : "var(--dark-blue)"};
    padding: ${getSpacing(0.8)} ${getSpacing(1.4)};
    border-radius: 100px;
    width: fit-content;
    border: 1px solid var(--grey-600);
  `
);

export const StyledCircle = styled.div<{ color: PillProps["color"] }>(
  ({ color }) => css`
    width: ${getSpacing(1.6)};
    height: ${getSpacing(1.6)};
    border-radius: 100px;
    background: ${getVarColor(color)};
  `
);
