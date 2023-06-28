import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

type SeoProps = {
  isMainPage?: boolean;
  title?: string;
  description?: string;
  image?: string;
};

export const Seo = ({ isMainPage, title, description, image }: SeoProps) => {
  const { t } = useTranslation();

  const seo = {
    title: title ?? t("seo.title"),
    description: description ?? t("seo.description"),
    image: image ?? require("../../assets/images/hats_og.png"),
  };

  // const allowedEndpoints = [
  //   "'self'",
  //   "https://*.hats.finance",
  //   "https://*.infura.io",
  //   "https://api.coingecko.com/",
  //   "https://cloudflare-eth.com/",
  //   new URL(stagingServiceUrl).protocol + "//" + new URL(stagingServiceUrl).host,
  //   new URL(prodServiceUrl).protocol + "//" + new URL(prodServiceUrl).host,
  //   ...Object.values(appChains).map((chain) => chain.subgraph),
  //   ...Object.values(appChains).map((chain) => chain.uniswapSubgraph),
  //   ...Object.values(externalPricingProvidersUrls),
  // ];
  // const connectSrc = allowedEndpoints.join(" ");

  return (
    <Helmet prioritizeSeoTags htmlAttributes={{ lang: "en" }} titleTemplate="%s | HatsFinance" title={seo.title}>
      {isMainPage && (
        <meta
          http-equiv="Content-Security-Policy"
          content={`default-src 'self'; connect-src * self 'unsafe-inline' blob: data: gap:; style-src 'self' 'unsafe-inline'; img-src * self 'unsafe-inline' blob: data: gap:;`}
        />
      )}
      {isMainPage && <link rel="canonical" href="https://app.hats.finance" />}
      <meta name="description" content={seo.description} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.description} />
      <meta name="og:type" content="webapp" />
      <meta name="og:site_name" content="Hats Finance" />
      <meta name="og:image" content={seo.image} />
      <meta name="og:image:alt" content="Hats Finance logo" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:site" content="@HatsFinance" />
      <meta name="twitter:creator" content="@HatsFinance" />
      <meta name="twitter:description" content={seo.description} />
    </Helmet>
  );
};
