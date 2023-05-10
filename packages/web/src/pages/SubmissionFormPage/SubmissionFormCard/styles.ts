import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

type StyledSubmissionFormCardProps = {
  isCollapsed: boolean;
  isVerified: boolean;
  isDisabled: boolean;
};

export const StyledSubmissionFormCard = styled.div<StyledSubmissionFormCardProps>(
  ({ isCollapsed, isVerified, isDisabled }) => css`
    margin-bottom: 10px;

    .card-header {
      background-color: var(--light-blue);
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        opacity: 0.8;
      }

      ${isVerified &&
      css`
        background-color: var(--turquoise);
        color: var(--dark-blue);
      `}

      ${isDisabled &&
      css`
        opacity: 0.5;
        pointer-events: none;
      `}

      .card-number {
        width: ${getSpacing(6)};
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--small);
      }
    }

    .card-title {
      color: var(--white);
      margin-right: 50px;
      font-weight: bold;
      border-left: 6px solid var(--dark-blue);
      padding: ${getSpacing(2)} ${getSpacing(3)};

      ${!isCollapsed &&
      css`
        color: var(--turquoise);
        font-weight: bold;
      `}

      ${isVerified &&
      css`
        color: var(--dark-blue);
      `}
    }

    .card-arrow {
      transform: rotate(0deg);
      transition: transform 0.1s linear;
      margin-left: auto;
      padding: ${getSpacing(2)};

      ${!isCollapsed &&
      css`
        transform: rotate(90deg);
        transition: transform 0.1s linear;
      `}
    }

    .card-body {
      padding: 20px 0 20px 55px;

      ${isCollapsed &&
      css`
        display: none;
      `}

      @media (max-width: ${breakpointsDefinition.mobile}) {
        padding: 20px;
      }

      .card-content {
        display: flex;
        flex-direction: column;
        color: var(--white);

        > div {
          margin: 20px 0px;
          line-height: 30px;
        }
      }
    }
  `
);
