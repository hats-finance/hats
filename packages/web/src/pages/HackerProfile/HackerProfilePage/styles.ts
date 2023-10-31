import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledHackerProfilePage = styled.div`
  .profile-card {
    display: flex;
    align-items: center;

    .description {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(0.5)};
      padding: 0 ${getSpacing(5)};

      h2 {
        font-size: var(--large-2);
      }

      p.hacker-title {
        font-size: var(--moderate);
      }
    }

    .socials {
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(1)};

      svg {
        width: ${getSpacing(5)};
        height: ${getSpacing(5)};
        cursor: pointer;
        transition: opacity 0.2s ease-in-out;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
`;
