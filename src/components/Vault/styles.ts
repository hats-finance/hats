import styled, { css } from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";

type StyledVaultProps = {
  type?: string;
};

export const StyledVault = styled.tr<StyledVaultProps>(
  ({ type }) => css`
    scroll-margin-top: var(--header-height) * 2;
    border-bottom: 2px solid var(--dark-blue);

    td {
      padding: 15px;
      background-color: var(--strong-blue);

      &:first-child {
        position: relative;
      }

      ${type === "gamification" &&
      css`
        background-color: var(--strong-purple);
      `}

      ${type === "grants" &&
      css`
        background-color: var(--turquoise-2);
      `}
    }

    .project-name-wrapper {
      display: flex;
      align-items: center;

      @media (max-width: ${breakpointsDefinition.mobile}) {
        margin-left: 30px;
      }

      img {
        width: 45px;
        margin-right: 15px;
        border-radius: 100px;
      }

      .name-source-wrapper {
        display: flex;
        flex-direction: column;
        text-align: left;

        .project-name {
          display: flex;
          align-items: center;
          font-weight: bold;
        }
      }
    }

    .balance-information {
      .vault-balance-wrapper {
        display: flex;
        text-align: left;
        white-space: nowrap;

        .balance-value {
          color: var(--white);
          font-weight: bold;
        }
      }

      .sub-label {
        font-size: var(--tiny);
        color: var(--gray);
      }
    }
  `
);

export const StyledVersionFlag = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  text-transform: uppercase;
  background-color: var(--turquoise);
  color: var(--strong-blue);
  padding: 10px 6px;
  border-radius: 0 0 18px 0;
  font-size: var(--xsmall);

  @media (max-width: ${breakpointsDefinition.mobile}) {
    margin-left: unset;
  }
`;

export const StyledVaultExpandAction = styled.div<{ expanded: boolean }>(
  ({ expanded }) => css`
    display: flex;
    justify-content: start;
    cursor: pointer;
    transform: rotate(0deg);
    transition: transform 0.1s linear;
    margin-left: 30px;
    width: 10px;
    height: 10px;

    &:hover {
      opacity: 0.8;
    }

    ${expanded &&
    css`
      transform: rotate(90deg);
      transition: transform 0.1s linear;
    `}
  `
);
