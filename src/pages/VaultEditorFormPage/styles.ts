import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";
import { getSpacing } from "styles";

export const VaultEditorForm = styled.form`
  @media (max-width: ${breakpointsDefinition.mobile}) {
    padding: 0 ${getSpacing(3)};
  }

  .editor-title {
    font-size: var(--large);
    color: var(--white);
  }

  .editor-description {
    color: var(--white);
    font-size: var(--small);
    margin-bottom: ${getSpacing(10)};
  }

  .last-saved-time {
    margin-bottom: ${getSpacing(5)};
    padding-bottom: ${getSpacing(2)};
    border-bottom: 1px solid var(--vault-editor-border);
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

  .mobile-buttons-container {
    display: flex;
    justify-content: space-between;
    gap: ${getSpacing(3)};

    button {
      width: 100%;
    }
  }
`;

export const Section = styled.div`
  .section-title {
    color: var(--white);
    font-size: var(--small);
    text-transform: uppercase;
  }

  .section-content {
    border: 1px solid var(--vault-editor-border-2);
    padding: ${getSpacing(5)};
    margin-bottom: ${getSpacing(5)};
  }
`;
