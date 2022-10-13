import styled, { css } from "styled-components";
import { getSpacing } from "styles";
import { HatsFormInputType } from "./HatsFormInput";

type StyledHatsFormInputProps = {
  isChanged: boolean;
  type: HatsFormInputType;
};

export const StyledHatsFormInput = styled.div<StyledHatsFormInputProps>(
  ({ isChanged, type }) => css`
    position: relative;
    overflow: hidden;
    margin-bottom: ${getSpacing(3)};

    input,
    textarea {
      width: 100%;
      margin: 0;
      text-indent: 0;
      background-color: transparent;
      color: var(--turquoise);
      border: 1px solid var(--turquoise);
      resize: none;

      &::placeholder {
        color: var(--dirty-turquoise);
        font-family: RobotoMono;
      }
    }

    textarea {
      padding: ${getSpacing(2)};

      ${isChanged &&
      css`
        border-color: var(--yellow);
      `}
    }

    input {
      padding: ${getSpacing(1.5)} ${getSpacing(2)};

      ${isChanged &&
      css`
        border-color: var(--yellow);
      `}
    }

    .extra-icons {
      bottom: 0;
      right: 2px;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--dark-blue);
      padding: ${getSpacing(1)};

      ${type === 'text' &&
      css`
        top: 50%;
        transform: translateY(-50%);
      `}

      ${type === 'textarea' &&
      css`
        bottom: 5px;
      `}

      img {
        cursor: pointer;
        width: ${getSpacing(3)};
        height: ${getSpacing(3)};
        transition: 0.2s;

        &:not(:first-child) {
          margin-left: ${getSpacing(1)};
        }

        &:hover {
          opacity: 0.7;
        }
        
        &:active {
          opacity: 0.4;

        }
      }
    }
  `
);
