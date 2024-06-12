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
        "converted_points": "1000",
        "token_eligibility": {
          "converted_from_points": "300000000000000000000"
        }
      },
      "0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6": {
        "converted_points": "2000",
        "token_eligibility": {
          "converted_from_points": "600000000000000000000"
        }
      },
      "0x56E889664F5961452E5f4183AA13AF568198eaD2": {
        "converted_points": "3000",
        "token_eligibility": {
          "converted_from_points": "900000000000000000000"
        }
      },
      "0xaFd8C4f6f5f0d64f0e8bcE4C22DAa7b575506400": {
        "converted_points": "1500",
        "token_eligibility": {
          "converted_from_points": "450000000000000000000"
        }
      },
      "0xCC5BD779A1EACeEFA704315A1F504446B6D25a1F": {
        "converted_points": "1500",
        "token_eligibility": {
          "converted_from_points": "450000000000000000000"
        }
      }
    }`);
    const merkeltree = await getAirdropMerkelTree(a);
    const contractInterface = new ethers.utils.Interface(HATAirdrop_abi);
    const initData = contractInterface.encodeFunctionData("initialize", [
      "QmUets2w319qkbcFXjsYdCsdwnq6mqTwWApPj4hQ8qPhjS",
      merkeltree.getHexRoot(),
      1714772105,
      1755792105,
      1755792105,
      60,
      "0xbdb34BB8665510d331FacAAaA0eeAe994a5B6612",
      "0x0153A75550E32CDf9a4458301bb89b600e745EAf",
    ]);

    console.log(initData);
  };

  return (
    <StyledAirdropsPage className="content-wrapper">
      {/* <button onClick={createAirdropHelper}>TEST</button> */}
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
