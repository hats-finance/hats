import { css } from "styled-components";
import { getSpacing } from "./utils.styles";

export const utilityClasses = css`
  .bold {
    font-weight: 700;
  }

  .flex-horizontal {
    display: flex;
    align-items: center;
    gap: ${getSpacing(2)};
  }

  .m-0 {
    margin: 0 !important;
  }

  .m-1 {
    margin: ${getSpacing(0.5)} !important;
  }

  .m-2 {
    margin: ${getSpacing(1)} !important;
  }

  .m-3 {
    margin: ${getSpacing(1.5)} !important;
  }

  .m-4 {
    margin: ${getSpacing(2)} !important;
  }

  .m-5 {
    margin: ${getSpacing(3)} !important;
  }

  .m-auto {
    margin: auto !important;
  }

  .mx-0 {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .mx-1 {
    margin-right: ${getSpacing(0.5)} !important;
    margin-left: ${getSpacing(0.5)} !important;
  }

  .mx-2 {
    margin-right: ${getSpacing(1)} !important;
    margin-left: ${getSpacing(1)} !important;
  }

  .mx-3 {
    margin-right: ${getSpacing(1.5)} !important;
    margin-left: ${getSpacing(1.5)} !important;
  }

  .mx-4 {
    margin-right: ${getSpacing(2)} !important;
    margin-left: ${getSpacing(2)} !important;
  }

  .mx-5 {
    margin-right: ${getSpacing(3)} !important;
    margin-left: ${getSpacing(3)} !important;
  }

  .mx-auto {
    margin-right: auto !important;
    margin-left: auto !important;
  }

  .my-0 {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  .my-1 {
    margin-top: ${getSpacing(0.5)} !important;
    margin-bottom: ${getSpacing(0.5)} !important;
  }

  .my-2 {
    margin-top: ${getSpacing(1)} !important;
    margin-bottom: ${getSpacing(1)} !important;
  }

  .my-3 {
    margin-top: ${getSpacing(1.5)} !important;
    margin-bottom: ${getSpacing(1.5)} !important;
  }

  .my-4 {
    margin-top: ${getSpacing(2)} !important;
    margin-bottom: ${getSpacing(2)} !important;
  }

  .my-5 {
    margin-top: ${getSpacing(3)} !important;
    margin-bottom: ${getSpacing(3)} !important;
  }

  .my-auto {
    margin-top: auto !important;
    margin-bottom: auto !important;
  }

  .mt-0 {
    margin-top: 0 !important;
  }

  .mt-1 {
    margin-top: ${getSpacing(0.5)} !important;
  }

  .mt-2 {
    margin-top: ${getSpacing(1)} !important;
  }

  .mt-3 {
    margin-top: ${getSpacing(1.5)} !important;
  }

  .mt-4 {
    margin-top: ${getSpacing(2)} !important;
  }

  .mt-5 {
    margin-top: ${getSpacing(3)} !important;
  }

  .mt-auto {
    margin-top: auto !important;
  }

  .mr-0 {
    margin-right: 0 !important;
  }

  .mr-1 {
    margin-right: ${getSpacing(0.5)} !important;
  }

  .mr-2 {
    margin-right: ${getSpacing(1)} !important;
  }

  .mr-3 {
    margin-right: ${getSpacing(1.5)} !important;
  }

  .mr-4 {
    margin-right: ${getSpacing(2)} !important;
  }

  .mr-5 {
    margin-right: ${getSpacing(3)} !important;
  }

  .mr-auto {
    margin-right: auto !important;
  }

  .mb-0 {
    margin-bottom: 0 !important;
  }

  .mb-1 {
    margin-bottom: ${getSpacing(0.5)} !important;
  }

  .mb-2 {
    margin-bottom: ${getSpacing(1)} !important;
  }

  .mb-3 {
    margin-bottom: ${getSpacing(1.5)} !important;
  }

  .mb-4 {
    margin-bottom: ${getSpacing(2)} !important;
  }

  .mb-5 {
    margin-bottom: ${getSpacing(3)} !important;
  }

  .mb-auto {
    margin-bottom: auto !important;
  }

  .ml-0 {
    margin-left: 0 !important;
  }

  .ml-1 {
    margin-left: ${getSpacing(0.5)} !important;
  }

  .ml-2 {
    margin-left: ${getSpacing(1)} !important;
  }

  .ml-3 {
    margin-left: ${getSpacing(1.5)} !important;
  }

  .ml-4 {
    margin-left: ${getSpacing(2)} !important;
  }

  .ml-5 {
    margin-left: ${getSpacing(3)} !important;
  }

  .ml-auto {
    margin-left: auto !important;
  }

  .p-0 {
    padding: 0 !important;
  }

  .p-1 {
    padding: ${getSpacing(0.5)} !important;
  }

  .p-2 {
    padding: ${getSpacing(1)} !important;
  }

  .p-3 {
    padding: ${getSpacing(1.5)} !important;
  }

  .p-4 {
    padding: ${getSpacing(2)} !important;
  }

  .p-5 {
    padding: ${getSpacing(3)} !important;
  }

  .px-0 {
    padding-right: 0 !important;
    padding-left: 0 !important;
  }

  .px-1 {
    padding-right: ${getSpacing(0.5)} !important;
    padding-left: ${getSpacing(0.5)} !important;
  }

  .px-2 {
    padding-right: ${getSpacing(1)} !important;
    padding-left: ${getSpacing(1)} !important;
  }

  .px-3 {
    padding-right: ${getSpacing(1.5)} !important;
    padding-left: ${getSpacing(1.5)} !important;
  }

  .px-4 {
    padding-right: ${getSpacing(2)} !important;
    padding-left: ${getSpacing(2)} !important;
  }

  .px-5 {
    padding-right: ${getSpacing(3)} !important;
    padding-left: ${getSpacing(3)} !important;
  }

  .py-0 {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .py-1 {
    padding-top: ${getSpacing(0.5)} !important;
    padding-bottom: ${getSpacing(0.5)} !important;
  }

  .py-2 {
    padding-top: ${getSpacing(1)} !important;
    padding-bottom: ${getSpacing(1)} !important;
  }

  .py-3 {
    padding-top: ${getSpacing(1.5)} !important;
    padding-bottom: ${getSpacing(1.5)} !important;
  }

  .py-4 {
    padding-top: ${getSpacing(2)} !important;
    padding-bottom: ${getSpacing(2)} !important;
  }

  .py-5 {
    padding-top: ${getSpacing(3)} !important;
    padding-bottom: ${getSpacing(3)} !important;
  }

  .pt-0 {
    padding-top: 0 !important;
  }

  .pt-1 {
    padding-top: ${getSpacing(0.5)} !important;
  }

  .pt-2 {
    padding-top: ${getSpacing(1)} !important;
  }

  .pt-3 {
    padding-top: ${getSpacing(1.5)} !important;
  }

  .pt-4 {
    padding-top: ${getSpacing(2)} !important;
  }

  .pt-5 {
    padding-top: ${getSpacing(3)} !important;
  }

  .pr-0 {
    padding-right: 0 !important;
  }

  .pr-1 {
    padding-right: ${getSpacing(0.5)} !important;
  }

  .pr-2 {
    padding-right: ${getSpacing(1)} !important;
  }

  .pr-3 {
    padding-right: ${getSpacing(1.5)} !important;
  }

  .pr-4 {
    padding-right: ${getSpacing(2)} !important;
  }

  .pr-5 {
    padding-right: ${getSpacing(3)} !important;
  }

  .pb-0 {
    padding-bottom: 0 !important;
  }

  .pb-1 {
    padding-bottom: ${getSpacing(0.5)} !important;
  }

  .pb-2 {
    padding-bottom: ${getSpacing(1)} !important;
  }

  .pb-3 {
    padding-bottom: ${getSpacing(1.5)} !important;
  }

  .pb-4 {
    padding-bottom: ${getSpacing(2)} !important;
  }

  .pb-5 {
    padding-bottom: ${getSpacing(3)} !important;
  }

  .pl-0 {
    padding-left: 0 !important;
  }

  .pl-1 {
    padding-left: ${getSpacing(0.5)} !important;
  }

  .pl-2 {
    padding-left: ${getSpacing(1)} !important;
  }

  .pl-3 {
    padding-left: ${getSpacing(1.5)} !important;
  }

  .pl-4 {
    padding-left: ${getSpacing(2)} !important;
  }

  .pl-5 {
    padding-left: ${getSpacing(3)} !important;
  }
`;
