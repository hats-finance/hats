import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledVaultEditorContainer = styled.div`
  .sections-controller {
    display: flex;
    gap: ${getSpacing(2)};
    margin-bottom: ${getSpacing(1)};
  }
`;

export const StyledVaultEditorForm = styled.div<{ withoutMargin?: boolean; noPadding?: boolean }>(
  ({ withoutMargin, noPadding }) => css`
    position: relative;
    background: var(--background-2);
    padding: ${noPadding ? "0" : getSpacing(3)};
    border-radius: ${getSpacing(0.5)};
    margin-bottom: ${withoutMargin ? "0" : `${getSpacing(6)} !important`};

    .editor-title {
      display: flex;
      justify-content: space-between;
      margin-top: ${getSpacing(2)};

      .title {
        display: flex;
        align-items: center;

        color: var(--white);
        font-size: var(--moderate);
        margin-bottom: ${getSpacing(5)};

        p {
          margin-left: ${getSpacing(1)};

          span {
            font-weight: 700;
          }
        }
      }
    }

    .descriptionHash,
    .lastModifiedOn {
      position: absolute;
      margin: 0;
      top: 0;
      left: ${getSpacing(2)};
      color: var(--grey-400);
      background: var(--grey-600);
      font-size: var(--xxsmall);
      padding: ${getSpacing(0.6)} ${getSpacing(1.4)};
      border-radius: 5px;
      transform: translateY(-50%);
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }

    .lastModifiedOn {
      cursor: default;
      left: unset;
      right: ${getSpacing(2)};

      &:hover {
        opacity: 1;
      }
    }

    .buttons-container {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      margin-top: ${getSpacing(3)};

      div {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        span {
          margin-top: ${getSpacing(1)};
          font-size: var(--xsmall);
          color: var(--error-red);
        }
      }

      div.backButton {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: ${getSpacing(2)};
      }
    }

    .editing-existing-buttons {
      margin-top: ${getSpacing(7)};
      padding-top: ${getSpacing(4)};
      display: flex;
      flex-direction: column;
      border-top: 2px solid var(--grey-600);

      .buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: ${getSpacing(2)};
      }
    }

    .helper-text {
      color: var(--grey-400);
      margin-bottom: ${getSpacing(4)};

      ul {
        padding-left: ${getSpacing(3)};
      }
    }

    .field-error {
      color: var(--error-red);
      margin-top: ${getSpacing(1)};
      font-size: var(--xxsmall);
    }

    .controller-buttons {
      display: flex;
      justify-content: flex-end;
      gap: ${getSpacing(2)};
      border-top: 1px solid var(--grey-600);
      padding-top: ${getSpacing(2)};

      &.no-line {
        padding-top: 0;
        border-top-color: transparent;
      }
    }
  `
);

export const VaultEditorStepper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${getSpacing(4)};
  border-bottom: 1px solid var(--grey-600);
  color: var(--white);
`;

export const VaultEditorStepController = styled.div<{ active?: boolean; passed?: boolean; disabled?: boolean }>(
  ({ active, passed, disabled }) => css`
    display: flex;
    align-items: center;
    padding-bottom: ${getSpacing(4)};
    border-bottom: 1px solid transparent;
    cursor: pointer;
    transition: 0.2s;

    ${active &&
    css`
      border-bottom-color: var(--secondary);
    `}

    ${passed &&
    css`
      color: var(--secondary);
    `}
      
      ${disabled &&
    css`
      color: var(--grey-600);
    `}
      
      &:hover {
      opacity: 0.7;
    }
  `
);

export const VaultEditorSectionController = styled.div<{ active?: boolean }>(
  ({ active }) => css`
    display: flex;
    align-items: center;
    color: var(--grey-400);
    margin-bottom: ${getSpacing(2)};
    cursor: pointer;
    transition: 0.2s;

    p {
      margin-right: ${getSpacing(2)};
    }

    ${active &&
    css`
      font-weight: 700;
      color: var(--secondary);
    `}

    &:hover {
      opacity: 0.7;
    }
  `
);

export const Section = styled.div<{ visible: boolean }>(
  ({ visible }) => css`
    display: ${visible ? "block" : "none"};

    .section-title {
      color: var(--white);
      font-size: var(--small);
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: ${getSpacing(2)};
      padding-bottom: ${getSpacing(2)};
      border-bottom: 1px solid var(--grey-600);

      &.no-underline {
        border-bottom: none;
      }

      &.no-bottom {
        padding-bottom: 0;
      }
    }

    .section-content {
      margin-bottom: ${getSpacing(5)};
    }
  `
);

export const StyledVerifiedEmailModal = styled.div<{ error: boolean }>(
  ({ error }) => css`
    max-width: 670px;
    color: var(--white);
    text-align: center;

    .info {
      background: var(--strong-blue);
      font-size: var(--small);
      line-height: 1.6;
      border-radius: ${getSpacing(1)};
      padding: ${getSpacing(4)};
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: ${getSpacing(3)};

      @media (max-width: ${breakpointsDefinition.mobile}) {
        padding: ${getSpacing(3)};
      }

      .title {
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: ${getSpacing(3)};
        display: flex;
        align-items: center;
        color: ${error ? "var(--error-red)" : "var(--turquoise)"};
        font-size: var(--moderate);
      }

      .description {
        margin-bottom: ${getSpacing(5)};
      }
    }
  `
);
