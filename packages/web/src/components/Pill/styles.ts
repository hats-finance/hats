import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { PillProps } from "./Pill";

const getVarColor = (color: PillProps["color"]) => {
  switch (color) {
    case "red":
      return "var(--error-red)";
    case "blue":
      return "var(--secondary)";
    case "yellow":
      return "var(--warning-yellow)";
    case "green":
      return "var(--success-green)";
  }
};

export const StyledPill = styled.div<{ transparent: boolean }>(
  ({ transparent }) => css`
    color: ${transparent ? "var(--white)" : "var(--secondary)"};
    font-size: var(--xxsmall);
    text-transform: none;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: ${getSpacing(0.8)};
    background: ${transparent ? "transparent" : "var(--background-2)"};
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
