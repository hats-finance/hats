import styled, { css } from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";
import { getSpacing } from "styles";

export const VaultEditorForm = styled.form`
  background: var(--background-clear-blue);
  padding: ${getSpacing(3)} ${getSpacing(4)};
  border-radius: ${getSpacing(0.5)};

  .editor-title {
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

  .buttons-container {
    display: flex;
    justify-content: flex-end;
    gap: ${getSpacing(3)};
    margin-bottom: ${getSpacing(5)};

    @media (max-width: ${breakpointsDefinition.mobile}) {
      flex-direction: column;
    }

    button {
      min-width: 30%;
      text-transform: uppercase;

      @media (max-width: ${breakpointsDefinition.mobile}) {
        width: 100%;
      }
    }
  }

  .helper-text {
    color: var(--white);
    margin-bottom: ${getSpacing(4)};

    ul {
      padding-left: ${getSpacing(3)};
    }
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
`;

export const VaultEditorStepper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${getSpacing(4)};
  border-bottom: 1px solid var(--grey-600);
  color: var(--white);
`;

export const VaultEditorStep = styled.div<{ active?: boolean; passed?: boolean; disabled?: boolean }>(
  ({ active, passed, disabled }) => css`
    display: flex;
    align-items: center;
    padding-bottom: ${getSpacing(4)};
    border-bottom: 1px solid transparent;
    cursor: pointer;

    ${active &&
    css`
      border-bottom-color: var(--turquoise);
    `}

    ${passed &&
    css`
      color: var(--turquoise);
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
    }

    .section-content {
      margin-bottom: ${getSpacing(20)};
    }
  `
);
