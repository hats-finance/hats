import { createGlobalStyle } from "styled-components";
import { breakpointsDefinition, responsiveUtilityClasses } from "./breakpoints.styles";
import { fonts } from "./fonts.styles";
import { utilityClasses } from "./utilities.styles";
import { variables } from "./variables.styles";

export const GlobalStyle = createGlobalStyle<{ theme: any }>`
    ${variables}
    ${responsiveUtilityClasses}
    ${utilityClasses}
    ${fonts}
    
    *,
    *::before,
    *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
        color: var(--white);
        /* font-size: var(--small); */
        font-size: var(--xsmall);
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    
    -webkit-scrollbar {
        display: none;
    }
    
    ::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }
    
    body {
        background-color: var(--background);
        margin: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        letter-spacing: 1px;
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
    }

    .vaults-wrapper {
        display: flex;
        flex-wrap: wrap;
    }

    button {
        font-size: var(--xsmall);
        border: none;
        padding: 10px;
        cursor: pointer;
        background-color: transparent;
        border: 1px solid var(--turquoise);
        color: var(--turquoise);
        cursor: pointer;

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
        margin-left: auto;
        margin-right: auto;
    }
    
    .content-wrapper-md {
        max-width: var(--element-max-width-md);
        white-space: pre-line;
        margin-left: auto;
        margin-right: auto;
    }
    
    .content-wrapper-sm {
        max-width: var(--element-max-width-sm);
        white-space: pre-line;
        margin-left: auto;
        margin-right: auto;
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

    input {
        background-color: var(--purple-blue);
        border: 1px solid var(--purple-blue);
        color: var(--white);
        text-indent: 20px;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    /* Remove inputs border highlight */
    input:focus,
    fieldset:focus,
    select:focus,
    textarea:focus,
    button:focus {
        outline: none;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes disabledFade {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0.5;
        }
    }

    /* additional className added to popup overlay (rc-tooltip) */
    .tooltip {
        opacity: 1 !important;
    }


    /* React hook form devtools */
    .form-devtool {
        .css-vv52sx {
            td {
                max-width: unset !important;
            }
        }
    }

    // Markdown styles
    .wmde-markdown {
        pre > code {
            background: var(--markdown-code-backgroud);
        }
    }
`;
