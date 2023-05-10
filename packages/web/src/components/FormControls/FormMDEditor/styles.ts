import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledFormMDEditor = styled.div<{
  hasError: boolean;
  isDirty: boolean;
}>(
  ({ hasError, isDirty }) => css`
    .w-md-editor {
      background-color: var(--dark-blue);
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
        background-color: var(--dark-blue);
        border-radius: 0;
        border-color: var(--grey-500);
      }

      .w-md-editor-preview {
        background-color: var(--dark-blue);
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
