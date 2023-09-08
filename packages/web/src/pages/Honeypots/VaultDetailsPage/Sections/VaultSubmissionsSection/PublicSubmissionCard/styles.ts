import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledPublicSubmissionCard = styled.div<{ isOpen: boolean }>(
  ({ isOpen }) => css`
    position: relative;

    .card-header {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(1.5)};
      border: 1px solid var(--primary-light);
      padding: ${getSpacing(3)} ${getSpacing(4)};
      background: var(--background-2);
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        border-color: var(--primary);
      }

      .date {
        position: absolute;
        top: ${getSpacing(3)};
        right: ${getSpacing(4)};
      }

      .submission-title {
        font-size: var(--small);
        padding-left: ${getSpacing(1)};
        font-weight: 700;
      }
    }

    .card-content {
      overflow: hidden;
      height: 0;

      ${isOpen &&
      css`
        height: auto;
      `}

      .submission-content {
        white-space: normal;
        font-size: var(--xsmall);
        background: var(--background-3);
        padding: ${getSpacing(3)} ${getSpacing(4)};
        color: var(--white);
        border: 1px solid var(--primary-light);
        border-top: none;
      }
    }
  `
);
