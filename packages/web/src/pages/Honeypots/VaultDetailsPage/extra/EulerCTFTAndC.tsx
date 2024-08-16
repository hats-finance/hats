import { StyledTermsAndConditions } from "./styles";

export const EulerCTFTAndC = () => {
  return (
    <StyledTermsAndConditions>
      <h2 className="main-title">Terms and Conditions</h2>
      <h2>Euler v2 Lite Paper - The Modular Lending Platform</h2>
      <h3>Introduction</h3>
      <p>
        Euler v2 is a modular lending platform with two main components at launch: 1) the Euler Vault Kit (EVK), which empowers
        builders to deploy and chain together their own customised lending vaults in a permissionless manner; and 2) the Ethereum
        Vault Connector (EVC), a powerful, immutable, primitive which give vaults superpowers by allowing their use as collateral
        for other vaults. Together, the EVK and EVC provide the flexibility to build or recreate any type of pre-existing or
        future-state lending product inside the Euler ecosystem.
      </p>
      <p>
        As DeFi evolves, Euler's modular design, with an immutable primitive at its foundation, enables it to scale and
        continuously grow without limits. Euler v2 provides a best-in-class experience for lenders and traders alike, by providing
        unparalleled access to diverse risk/reward opportunities, new collateral options, lower net borrowing costs, advanced risk
        management tools such as sub-accounts and profit and loss simulators, custom-built limit order types (including stop-loss
        and take-profit), and greatly reduced liquidation costs.
      </p>
      <h3>Euler Vault Kit (EVK)</h3>
      <p>
        At the product layer, Euler v2 is a system of ERC-4626 vaults built using a custom-built vault development kit, called the
        EVK, and chained together using the EVC. The vault kit is agnostic about governance, upgradability, oracles, and much
        else. Different vault classes support different use-cases, giving users freedom through choice and modularity. Euler v2
        will launch with three initial classes of vaults built on the EVK. Builders can customise and integrate these as they
        wish, or design their own vaults with just a few clicks.
      </p>
      <p>
        In addition to these products, the EVK lets more advanced users custom-build their own vaults outside of the Euler product
        specifications to suit their individual needs. Ultimately, the EVK is agnostic about oracles, interest rate models,
        governance, upgradability, and more. Advanced users could deploy Edge-like vaults with governance support or custom
        liquidation flows or real-world assets (RWAs) with compliance restrictions, for example. Developers could create their own
        Core-like lending product in parallel to the one governed by Euler DAO. Whatever type of vaults builders create, the
        important thing is that, thanks to the EVC and its modular approach, new vaults can always be connected to other vaults in
        the ecosystem.
      </p>
    </StyledTermsAndConditions>
  );
};
