const fs = require("fs");

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
  "https://api.thegraph.com/subgraphs/name/hats-finance/hats",
  "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism",
  // "https://api.thegraph.com/subgraphs/name/hats-finance/hats_goerli",
  // "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism_goerli",
  "https://api.thegraph.com/subgraphs/name/hats-finance/hats_arbitrum",
  "https://api.thegraph.com/subgraphs/name/hats-finance/hats_polygon",
];
const buildPath = "./build/sitemap.xml";
const publicUrl = "https://app.hats.finance";
const ipfsPrefix = "https://ipfs2.hats.finance/ipfs";

const routes = [
  { path: "/vaults/bug-bounties" },
  { path: "/vaults/audit-competitions" },
  { path: "/vulnerability" },
  { path: "/vault-editor" },
];

const buildSitemap = async () => {
  const subgraphPromises = subgraphs.map((subgraph) => {
    return fetch(subgraph, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
  });
  const subgraphResults = (
    await Promise.all(subgraphPromises).then((responses) => Promise.all(responses.map((res) => res.json())))
  )
    .map((res) => res.data.vaults)
    .flat()
    .filter((vault) => vault.registered);
  const descriptionHashes = subgraphResults.map((vault) => vault.descriptionHash);

  const descriptionsPromises = descriptionHashes.map((descriptionHash) => {
    return { hash: descriptionHash, promise: fetch(`${ipfsPrefix}/${descriptionHash}`) };
  });
  const descriptionsResults = await Promise.all(descriptionsPromises.map((desc) => desc.promise));
  const descriptionsData = await Promise.all(descriptionsResults.map((res) => res.json()).map((p) => p.catch((e) => e)));
  const descriptionsDataWithHash = descriptionsData.map((d) => ({ ...d, hash: descriptionHashes[descriptionsData.indexOf(d)] }));
  const descriptions = descriptionsDataWithHash.filter((d) => !(d instanceof Error));
  const vaultsRoutes = descriptions.map((d) => {
    const vaultId = subgraphResults.find((vault) => vault.descriptionHash === d.hash).id;
    const vaultSlug = slugify(d["project-metadata"]?.name ?? d["Project-metadata"]?.name ?? "");
    const isAudit =
      d["project-metadata"]?.type === "audit" ??
      d["project-metadata"]?.type === "Audit Competition" ??
      d["Project-metadata"]?.type === "audit" ??
      d["Project-metadata"]?.type === "Audit Competition";

    return { path: `/vaults/${isAudit ? "audit-competitions" : "bug-bounties"}/${vaultSlug}-${vaultId}` };
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...routes, ...vaultsRoutes].reduce(
    (acc, route) => `${acc}
    <url>
      <loc>${publicUrl}${route.path}</loc>
      <changefreq>daily</changefreq>
      <priority>0.5</priority>
    </url>`,
    ""
  )}
  </urlset>
  `;

  fs.writeFileSync(buildPath, xml);
  console.info(`> ✔️ Sitemap successfully generated at ${buildPath}`);
};

buildSitemap();
