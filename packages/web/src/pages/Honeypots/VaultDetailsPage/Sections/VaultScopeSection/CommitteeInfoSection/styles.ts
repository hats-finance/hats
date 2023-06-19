import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledCommitteeInfoSection = styled.div`
  .committee-address {
    display: flex;
    align-items: center;
    gap: ${getSpacing(1)};
  }

  .members {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    margin-top: ${getSpacing(4)};

    .member {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${getSpacing(1)};

      img {
        width: ${getSpacing(8)};
        height: ${getSpacing(8)};
        object-fit: cover;
        border-radius: 50%;
      }
    }
  }
`;
