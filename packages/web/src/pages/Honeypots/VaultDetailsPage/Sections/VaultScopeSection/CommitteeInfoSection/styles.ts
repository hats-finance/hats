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
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: ${getSpacing(4)};
    margin-top: ${getSpacing(4)};
    margin-bottom: ${getSpacing(2)};

    .member {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${getSpacing(0.5)};

      img {
        width: ${getSpacing(8)};
        height: ${getSpacing(8)};
        object-fit: cover;
        border-radius: 50%;
      }
    }
  }
`;
