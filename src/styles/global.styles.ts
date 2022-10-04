import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    html {
        background-color: $dark-blue;
        color: $turquoise;
        font-size: $small;
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
