import styled from "styled-components";
import { breakpointsDefinition } from "styles/breakpoints.styles";
import { getSpacing } from "styles";

export const StyledSubmissionSuccessModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;

  @media only screen and (max-width: ${breakpointsDefinition.smallMobile}) {
    min-width: unset;
    width: 100%;
  }

  .successIcon {
    width: ${getSpacing(6)};
  }

  .title {
    width: 80%;
    font-size: var(--small);
    text-transform: uppercase;
    color: var(--white);
    font-weight: 600;
    text-align: center;
    margin-top: ${getSpacing(3)};
  }

  .discord-cta,
  .wherever-cta {
    margin-top: ${getSpacing(4)};
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .discord-cta {
    gap: ${getSpacing(2)};
  }

  .wherever-cta {
    padding: ${getSpacing(3)};
    border-radius: ${getSpacing(1.5)};
    gap: ${getSpacing(1)};
    background: var(--strong-blue);

    .new-flag {
      display: flex;
      align-items: center;
      text-transform: uppercase;
      font-size: var(--moderate);
      color: var(--white);
      gap: ${getSpacing(1)};

      img {
        width: ${getSpacing(4)};
      }
    }

    .title {
      width: 100%;
      margin-top: 0;
    }

    .description {
      width: 80%;
      text-align: center;
      color: var(--white);
      margin: ${getSpacing(2)} 0;
    }
  }
`;
