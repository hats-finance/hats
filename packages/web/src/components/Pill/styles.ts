import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { PillProps } from "./Pill";

const getVarColor = (color: PillProps["dotColor"]) => {
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

export const StyledPill = styled.div<{
  transparent: PillProps["transparent"];
  textColor: PillProps["textColor"];
  isSeverity: PillProps["isSeverity"];
  isChecked: PillProps["isChecked"];
  canMultiline: PillProps["canMultiline"];
  isOnClickEnabled: boolean;
}>(
  ({ transparent, textColor, isSeverity, isChecked, isOnClickEnabled, canMultiline }) => css`
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

    ${!!textColor &&
    css`
      color: ${textColor};
    `}

    ${isSeverity &&
    css`
      font-size: var(--xxsmall);
      font-weight: 700;
      padding: ${getSpacing(0.8)} ${getSpacing(2)};
      border: 1px solid var(--primary-light);
    `}

    ${isOnClickEnabled !== undefined &&
    css`
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        opacity: 0.8;
      }
    `}

    ${!isOnClickEnabled &&
    css`
      cursor: default;

      &:hover {
        opacity: 1;
      }
    `}

    ${isChecked !== undefined &&
    isChecked &&
    css`
      color: var(--secondary);
      background: var(--secondary-lighter);
      border-color: transparent;
    `}
      
      ${isChecked !== undefined &&
    !isChecked &&
    css`
      color: var(--white);
      background: transparent;
    `}

    span {
      overflow: hidden;
      display: -webkit-box;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      text-transform: capitalize;

      ${canMultiline &&
      css`
        line-clamp: unset;
        -webkit-line-clamp: unset;
      `}
    }
  `
);

export const StyledDot = styled.div<{ color: PillProps["dotColor"] }>(
  ({ color }) => css`
    width: ${getSpacing(1.6)};
    height: ${getSpacing(1.6)};
    border-radius: 100px;
    background: ${getVarColor(color)};
  `
);
