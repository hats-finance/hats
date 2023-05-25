import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledFormMDEditor = styled.div<{
  hasError: boolean;
  isDirty: boolean;
  noMargin: boolean;
}>(
  ({ hasError, isDirty, noMargin }) => css`
    margin-bottom: ${noMargin ? 0 : getSpacing(3)};

    .w-md-editor {
      background-color: transparent;
      border-radius: 0;
      border: 1px solid var(--grey-500);
      box-shadow: none;
      overflow: hidden;

      * {
        font-size: var(--xsmall) !important;
      }

      ${hasError &&
      css`
        border-color: var(--error-red);
      `}

      ${isDirty &&
      css`
        border-color: var(--yellow);
      `}

      @media (max-width: ${breakpointsDefinition.mobile}) {
        height: 220px !important;
      }

      .w-md-editor-toolbar {
        background-color: transparent;
        border-radius: 0;
        border-color: var(--grey-500);

        ul {
          display: flex;
          align-items: flex-start;
        }
      }

      .w-md-editor-preview {
        background-color: transparent;
        border-radius: 0;
        border-left: 1px solid var(--grey-500);
        box-shadow: none;

        .wmde-markdown.wmde-markdown-color {
          background-color: transparent;
        }
      }
    }

    span.error {
      display: block;
      color: var(--error-red);
      margin-top: ${getSpacing(0.5)};
      margin-left: ${getSpacing(1)};
      font-size: var(--xxsmall);
    }
  `
);
