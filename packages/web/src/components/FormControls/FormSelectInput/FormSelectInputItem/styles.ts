import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledFormSelectInputItem = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${getSpacing(1)};
  padding: ${getSpacing(2)};
  user-select: none;
  color: var(--white);
  font-size: var(--xsmall);

  &:hover {
    background-color: var(--background-2);
  }

  .info {
    width: calc(100% - ${getSpacing(5)});
    display: flex;
    align-items: center;
    gap: ${getSpacing(1)};
    text-transform: capitalize;

    img {
      width: ${getSpacing(3.8)};
      height: ${getSpacing(3.8)};
      object-fit: contain;
    }

    .text {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      text-overflow: ellipsis;

      span {
        padding-left: ${getSpacing(1)};

        &.helper {
          width: 100%;
          text-overflow: ellipsis;
          font-size: var(--xxsmall);
          display: block;
          overflow: hidden;
          color: var(--grey-500);
          margin-top: ${getSpacing(0.5)};

          .vault-address {
            display: flex;
            align-items: center;
            gap: ${getSpacing(0.5)};
          }
        }
      }
    }
  }

  input {
    display: none;
  }
`;
