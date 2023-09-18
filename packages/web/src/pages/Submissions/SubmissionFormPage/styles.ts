import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledSubmissionFormPage = styled.div`
  position: relative;

  .accordion-wrapper {
    max-width: var(--element-max-width);
    margin: auto;
  }

  .top-controls {
    display: flex;
    align-items: center;
    gap: ${getSpacing(1)};
    margin-bottom: ${getSpacing(4)};

    .auditWizardSubmission {
      display: flex;
      flex-direction: column;
      gap: ${getSpacing(1)};
      align-items: flex-start;
      background: var(--background-3);
      width: fit-content;
      padding: ${getSpacing(1.5)} ${getSpacing(2)};
      border-radius: ${getSpacing(1)};

      img {
        height: ${getSpacing(3)};
      }

      p {
        font-size: var(--xxsmall);
      }
    }
  }
`;
