import { breakpointsDefinition } from './breakpoints.styles';
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

        @media only screen and (max-width: ${breakpointsDefinition.smallScreen}) {
            font-size: var(--xsmall);
        }
    }


    body {
        margin: 0;
        font-family: RobotoMono;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        letter-spacing: 1px;
    }

    .vaults-wrapper {
        display: flex;
        flex-wrap: wrap;
    }

    button {
        font-family: RobotoMono;
        font-size: var(--small);
        border: none;
        padding: 10px;
        cursor: pointer;
        background-color: transparent;
        border: 1px solid var(--turquoise);
        color: var(--turquoise);
        font-family: RobotoMono;
        cursor: pointer;

        @media only screen and (max-width: ${breakpointsDefinition.smallScreen}) {
            font-size: var(--xsmall);
        }

        &:hover {
            opacity: 0.8;
        }

        &:disabled {
            pointer-events: none;
            opacity: 0.5;
        }

        &:focus {
            outline: none;
            box-shadow: none;
        }
        
        &.fill {
            background-color: var(--turquoise);
            color: var(--dark-blue);
        }
    }

    a {
        color: var(--white);
        text-decoration: none;
        
        &:hover {
            opacity: 0.8;
        }
    }

    /* This is used to a content div (not header and not sidebar), e.g. Honeypots, Gov, ... */
    .content {
        padding-top: calc(var(--header-height) + 100px);
        margin-left: calc(var(--sidebar-width) + 50px);
        margin-right: 50px;
        white-space: pre-line;
    }

    .seperator {
        height: 1px;
        margin: 20px 0;
        background-color: var(--dark-turquoise);
    }

    /* Default input border color when not valid */
    .input-error {
        border-color: var(--strong-red) !important;
    }

    /* This goes with <br /> tag to break line only in mobile */
    .mobile-break {
        display: none;
    }

    /* swiper/react styles for prev and next buttons */
    .swiper-button-prev,
    .swiper-button-next {
        color: var(--black);
        background-color: var(--white);
        border-radius: 50%;
        width: 15px;
        height: 15px;
        padding: 5px;

        &::after {
            font-size: var(--xsmall);
            font-weight: bold;
        }
    }

    @media only screen and (max-width: ${breakpointsDefinition.mobile}) {
        .content {
            padding-top: var(--header-height) + 50;
            margin-left: unset;
            margin-right: unset;
        }

        /* This goes with <br /> tag to break line only in mobile */
        .mobile-break {
            display: block;
        }
    }
`;
