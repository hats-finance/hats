import styled, { css } from "styled-components";

type StyledMenuProps = {
  show: boolean;
};

export const StyledMenu = styled.div<StyledMenuProps>(
  ({ show }) => css`
    position: fixed;
    width: 100%;
    height: 100vh;
    display: ${show ? "flex" : "none"};
    flex-direction: column;
    z-index: 5;
    background-color: var(--dark-blue);
    top: var(--header-height);
    border-bottom: 2px solid var(--turquoise);
    overflow-x: scroll;
  `
);
