import styled from "styled-components";
import { getSpacing } from "styles";

const size = 20;

export const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${getSpacing(1.5)};

  span {
    font-size: var(--tiny);
  }
  .lds-ring {
    display: inline-block;
    position: relative;
    width: ${size}px;
    height: ${size}px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${size * 0.8}px;
    height: ${size * 0.8}px;
    margin: ${size * 0.1}px;
    border: ${size * 0.1}px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
