import { breakpointsDefinition, responsiveUtilityClasses } from "./breakpoints.styles";
import { createGlobalStyle } from "styled-components";
import { variables } from "./variables.styles";

export const GlobalStyle = createGlobalStyle`
    ${variables}
    ${responsiveUtilityClasses}
    
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    html {
        background-color: var(--dark-blue);
        color: var(--turquoise);
        font-size: var(--small);
        scrollbar-width: none;
        -ms-overflow-style: none;

        
        @media only screen and (max-width: ${breakpointsDefinition.smallScreen}) {
            font-size: var(--xsmall);
        }
    }
    
    -webkit-scrollbar {
        display: none;
    }

    ::-webkit-scrollbar {
        width: 0;
        background: transparent;
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
        white-space: pre-line;
    }
    
    .content-wrapper {
        max-width: var(--element-max-width);
        white-space: pre-line;
        margin: 0 auto;
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
        /* This goes with <br /> tag to break line only in mobile */
        .mobile-break {
            display: block;
        }
    }
`;
