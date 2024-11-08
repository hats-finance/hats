import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSubmissionsSection = styled.div`
  padding-bottom: ${getSpacing(10)};

  .public-submissions {
    margin-top: ${getSpacing(3)};
    display: flex;
    flex-direction: column;
    gap: ${getSpacing(3)};
  }

  .bonus-points-section {
    border: 2px solid var(--primary);
    padding: ${getSpacing(3)} ${getSpacing(4)};
    margin-bottom: ${getSpacing(4)};

    .title-container {
      display: flex;
      align-items: center;
      gap: ${getSpacing(1)};
      margin-bottom: ${getSpacing(2)};
      font-size: var(--moderate-big);
      font-weight: 600;

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${getSpacing(4.5)};
        height: ${getSpacing(4.5)};
        padding: ${getSpacing(1)};
        border-radius: 50%;
        background-color: var(--primary);
      }
    }

    .content {
      ul {
        line-height: 1.5;
        padding-left: ${getSpacing(3)};
      }
    }

    .remember {
      display: flex;
      align-items: center;
      margin-top: ${getSpacing(2)};
      gap: ${getSpacing(1)};
    }
  }
`;
