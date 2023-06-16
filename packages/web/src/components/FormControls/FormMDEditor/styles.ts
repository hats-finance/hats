import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { breakpointsDefinition } from "styles/breakpoints.styles";

export const StyledFormMDEditor = styled.div<{
  hasError: boolean;
  isDirty: boolean;
  noMargin: boolean;
  disabled: boolean;
}>(
  ({ hasError, isDirty, noMargin, disabled }) => css`
    margin-bottom: ${noMargin ? 0 : getSpacing(3)};

    .w-md-editor {
      background-color: transparent;
      border-radius: 0;
      border: 1px solid var(--grey-500);
      box-shadow: none;
      overflow: hidden;
      white-space: normal;
      color: var(--white);

      * {
        font-family: "IBM Plex Sans", sans-serif !important;
      }

      ${disabled &&
      css`
        &::after {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--disabled-input);
          opacity: 0.4;
          z-index: 1;
          cursor: not-allowed;
        }
      `}

      * {
        font-size: var(--xsmall) !important;
      }

      &.w-md-editor-fullscreen {
        .w-md-editor-content,
        .w-md-editor-toolbar {
          background-color: var(--background);
        }
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
        color: var(--white);

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
