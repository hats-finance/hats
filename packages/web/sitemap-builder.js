const fs = require("fs");
const axios = require("axios");

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const query = `
query {
  vaults {
    id
    descriptionHash
    registered
  }
}
`;
const subgraphs = [
  "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/2cbCwzhBbKkdpXtuNYkG5ch5dJDNAnTmeRhePDpkR4JV", // Mainnet
  "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/vMkoKYXdwa5dww7FD6ra9EdLgA2E3hmz2Q3BxF8DEAW", // Optimism
  "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/GXUgxLXF1Ad2dmmxF5J24JUGKj6ko22t6esPkdLhKAz4", // Arbitrum
  "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/GH7Cv6XKuWYTMUrXcAfcqRmJRERPxFThyHtz1AeNCZQa", // Polygon
  "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/4TWs2Y9gCpUPh1vMSogFuRbBqsUzE4FXgYFAoJmcx9Fc", // BSC
];
const buildPath = "./build/sitemap.xml";
const publicUrl = "https://app.hats.finance";
const ipfsPrefix = "https://ipfs2.hats.finance/ipfs";

const routes = [
  { path: "/bug-bounties" },
  { path: "/audit-competitions" },
  { path: "/vulnerability" },
  { path: "/vault-editor" },
];

const buildSitemap = async () => {
  const subgraphPromises = subgraphs.map((subgraph) => {
    return axios({
      url: subgraph,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: { query },
    });
  });

  const subgraphResults = (
    await Promise.all(subgraphPromises)
      .then((responses) => responses.map((res) => res.data))
      .catch((error) => {
        console.error("Error fetching subgraph data:", error);
      })
  )
    .filter((res) => res != null)
    .map((res) => res.data.vaults)
    .flat()
    .filter((vault) => vault.registered);
  const descriptionHashes = subgraphResults.map((vault) => vault.descriptionHash);

  const descriptionsPromises = descriptionHashes.map((descriptionHash) => {
    return {
      hash: descriptionHash,
      promise: axios({
        url: `${ipfsPrefix}/${descriptionHash}`,
        method: "get",
      }),
    };
  });
  const descriptionsResults = await Promise.all(descriptionsPromises.map((desc) => desc.promise).map((p) => p.catch((e) => e)));
  const descriptionsData = await Promise.all(descriptionsResults.map((res) => res.data));
  const descriptionsDataWithHash = descriptionsData.map((d) => ({ ...d, hash: descriptionHashes[descriptionsData.indexOf(d)] }));
  const descriptions = descriptionsDataWithHash.filter((d) => !(d instanceof Error));
  const descriptionsNoPrivateAudits = descriptions.filter((d) => !d["project-metadata"]?.isPrivateAudit);
  const vaultsRoutes = descriptionsNoPrivateAudits.map((d) => {
    const vaultId = subgraphResults.find((vault) => vault.descriptionHash === d.hash).id;
    const vaultSlug = slugify(d["project-metadata"]?.name ?? d["Project-metadata"]?.name ?? "");
    const isAudit =
      d["project-metadata"]?.type === "audit" ??
      d["project-metadata"]?.type === "Audit Competition" ??
      d["Project-metadata"]?.type === "audit" ??
      d["Project-metadata"]?.type === "Audit Competition";

    return { path: `/${isAudit ? "audit-competitions" : "bug-bounties"}/${vaultSlug}-${vaultId}` };
  });
  const appendPathAndGenerateUrl = (route, path) => {
    return `
      <url>
        <loc>${publicUrl}${route.path}/${path}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
      </url>`;
  };

  const vaultsRoutesXml = vaultsRoutes.reduce(
    (acc, route) => `${acc}
    ${appendPathAndGenerateUrl(route, "rewards")}
    ${appendPathAndGenerateUrl(route, "deposits")}
    ${appendPathAndGenerateUrl(route, "scope")}`,
    ""
  );

  const routesXml = routes.reduce(
    (acc, route) => `${acc}
    ${appendPathAndGenerateUrl(route, "")}`,
    ""
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routesXml}
  ${vaultsRoutesXml}
  </urlset>
  `;

  fs.writeFileSync(buildPath, xml);
  console.info(`> ✔️ Sitemap successfully generated at ${buildPath}`);
};

buildSitemap();
