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
    margin-bottom: ${getSpacing(5)};

    ul {
      padding-left: ${getSpacing(3)};
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

export const VaultEditorStep = styled.div<{ active: boolean; passed: boolean }>(
  ({ active, passed }) => css`
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

    &:hover {
      opacity: 0.7;
    }
  `
);

export const Section = styled.div`
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
`;
