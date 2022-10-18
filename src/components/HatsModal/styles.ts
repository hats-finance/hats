import { getSpacing } from "styles";
import styled from "styled-components";

export const StyledModal = styled.div`
  position: fixed;
  z-index: 1040;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--black);
    opacity: 0.5;
  }
`;

export const ModalContainer = styled.div`
  position: relative;
  background: var(--field-blue);
  max-width: 700px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${getSpacing(1)} ${getSpacing(4)};
    border-bottom: 1px solid var(--turquoise);

    .title {
      color: var(--white);
      font-size: var(--small);
      text-transform: uppercase;
    }

    .close {
      padding: 0;
      border: none;
      cursor: pointer;
      font-size: var(--medium-2);
      margin-left: ${getSpacing(10)};
    }
  }

  .content {
    padding: ${getSpacing(2)} ${getSpacing(4)} ${getSpacing(3)};
  }
`;
