import styled, { css } from "styled-components";
import { getSpacing } from "styles";

export const StyledVaultEditorContainer = styled.div`
  .sections-controller {
    display: flex;
    gap: ${getSpacing(2)};
  }
`;

export const VaultEditorForm = styled.form`
  position: relative;
  background: var(--background-clear-blue);
  padding: ${getSpacing(3)} ${getSpacing(4)};
  border-radius: ${getSpacing(0.5)};
  margin-bottom: ${getSpacing(8)} !important;

  .editor-title {
    display: flex;
    justify-content: space-between;

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

  .descriptionHash {
    position: absolute;
    margin: 0;
    top: 0;
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

  .buttons-container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;

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
  }

  .helper-text {
    color: var(--white);
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
`;

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
      color: var(--turquoise);
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
      margin-bottom: ${getSpacing(5)};
    }
  `
);
