import { HATAirdrop_abi } from "@hats.finance/shared";
import AirdropVideo from "assets/videos/airdrop-v2.mp4";
import { Button } from "components";
import { ethers } from "ethers";
import { useTranslation } from "react-i18next";
import { getAirdropMerkelTree } from "../utils/getAirdropMerkelTree";
import { AirdropCheckElegibility } from "./components/AirdropCheckElegibility/AirdropCheckElegibility";
import { AirdropFAQ } from "./components/AirdropFAQ/AirdropFAQ";
import { HatsTokenInfo } from "./components/HatsTokenInfo/HatsTokenInfo";
import { StyledAirdropsPage } from "./styles";

export const AirdropsPage = () => {
  const { t } = useTranslation();

  const createAirdropHelper = async () => {
    const a = JSON.parse(`{
      "0xC2d10F4dE6e9cF298D7e79Db5126184f5f883A69": {
        "token_eligibility": {
          "committee_member": "0",
          "depositor": "100000000000000000000",
          "crow": "0",
          "coder": "0",
          "early_contributor": "300000000000000000000"
        }
      },
      "0x0B7602011EC2B862Bc157fF08d27b1018aEb18d5": {
        "token_eligibility": {
          "committee_member": "0",
          "depositor": "100000000000000000000",
          "crow": "0",
          "coder": "0",
          "early_contributor": "0"
        }
      },
      "0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6": {
        "token_eligibility": {
          "committee_member": "100000000000000000000",
          "depositor": "200000000000000000000",
          "crow": "0",
          "coder": "80000000000000000000",
          "early_contributor": "0"
        }
      },
      "0xaFd8C4f6f5f0d64f0e8bcE4C22DAa7b575506400": {
        "token_eligibility": {
          "committee_member": "100000000000000000000",
          "depositor": "200000000000000000000",
          "crow": "0",
          "coder": "80000000000000000000",
          "early_contributor": "0"
        }
      },
      "0xCC5BD779A1EACeEFA704315A1F504446B6D25a1F": {
        "token_eligibility": {
          "committee_member": "100000000000000000000",
          "depositor": "200000000000000000000",
          "crow": "0",
          "coder": "70000000000000000000",
          "early_contributor": "0"
        }
      },
      "0x1885B7c7a3AE1F35BA71C0392C13153A95c4914f": {
        "token_eligibility": {
          "committee_member": "0",
          "depositor": "500000000000000000000",
          "crow": "0",
          "coder": "0",
          "early_contributor": "0"
        }
      }
    }`);
    const merkeltree = await getAirdropMerkelTree(a);
    const contractInterface = new ethers.utils.Interface(HATAirdrop_abi);
    const initData = contractInterface.encodeFunctionData("initialize", [
      "QmbGAmAaoCEs7zEzvhz7z8j7go1WcnvWbojwijd7F76BjX",
      merkeltree.getHexRoot(),
      1715772105,
      1721042505,
      1721042505,
      60,
      "0xbdb34BB8665510d331FacAAaA0eeAe994a5B6612",
      "0x0153A75550E32CDf9a4458301bb89b600e745EAf",
    ]);

    console.log(initData);
  };

  return (
    <StyledAirdropsPage className="content-wrapper">
      <div className="hero">
        <video id="airdrop-video" autoPlay muted playsInline>
          <source src={AirdropVideo} type="video/mp4" />
        </video>
        <div className="buttons">
          <a href="#check-elegibility">
            <Button>{t("Airdrop.checkElegibility")}</Button>
          </a>
        </div>
      </div>

      <HatsTokenInfo />
      <AirdropCheckElegibility />
      {/* <AirdropFAQ /> */}
    </StyledAirdropsPage>
  );
};
