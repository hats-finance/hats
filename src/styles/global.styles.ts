import { createGlobalStyle } from 'styled-components';
import { variables } from './variables.styles';

export const GlobalStyle = createGlobalStyle`
    ${variables}

    html {
        background-color: var(--dark-blue);
        color: var(--turquoise);
        font-size: var(--small);
        scrollbar-width: none;
        -ms-overflow-style: none;

        -webkit-scrollbar {
            display: none;
        }

        ::-webkit-scrollbar {
            width: 0;
            background: transparent;
        }
    }

    body {
        margin: 0;
        font-family: RobotoMono;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        letter-spacing: 1px;
    }
`;
