import styled from "styled-components";
import { getSpacing } from "styles";

export const StyledKeystoreActions = styled.div`
  width: 100%;
  display: flex;
  gap: ${getSpacing(2)};
  margin: ${getSpacing(2)} 0;

  .action {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--grey-500);
    padding: ${getSpacing(3)};
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background-color: var(--background-2);
      border-color: var(--primary);
    }

    .icon {
      font-size: ${getSpacing(5)};
    }

    p {
      text-align: center;
    }
  }
`;

export const StyledStoredKeys = styled.div`
  border: 1px solid var(--grey-500);
  max-height: 300px;
  overflow: auto;

  ::-webkit-scrollbar {
    width: ${getSpacing(1.8)};
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--grey-400);
    border-radius: 500px;
    border: 3px solid var(--background-1);
  }
`;

export const StyledBackupOption = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${getSpacing(4)};
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: var(--secondary);
  }
`;
