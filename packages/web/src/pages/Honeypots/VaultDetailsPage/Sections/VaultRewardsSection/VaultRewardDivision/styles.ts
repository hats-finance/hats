import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledDivisionInformation = styled.div<{ color: string }>(
  ({ color }) => css`
    height: ${getSpacing(8)};
    border-left: 6px solid ${color};
    padding-left: ${getSpacing(1.5)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${getSpacing(1)};
    margin-top: ${getSpacing(5)};

    h4 {
      font-size: var(--medium);
    }

    p {
      font-size: var(--xxsmall);
    }
  `
);
