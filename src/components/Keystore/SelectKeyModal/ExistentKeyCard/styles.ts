import styled from "styled-components";

export const StyledExistentKeyCard = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--turquoise);
  padding: 8px;

  p {
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }

  .fish-eye {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--dark-turquoise);
    margin: 3px;

    &.selected {
      position: relative;
      background-color: var(--turquoise);

      &:after {
        content: "";
        border: 1px solid var(--turquoise);
        border-radius: 50%;
        width: 23px;
        height: 23px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  a {
    color: var(--turquoise);
  }

  .title {
    flex: 1;
    display: flex;
    align-items: center;

    span {
      margin-left: 0.5em;
    }
  }

  .copy {
    margin-right: 15px;
  }

  .actions {
    align-self: flex-end;

    :not(:first-child) {
      margin-left: 5px;
    }
  }
`;
