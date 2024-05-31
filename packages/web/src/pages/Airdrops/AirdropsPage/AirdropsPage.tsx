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
          "converted_from_points": "100000000000000000000"
        }
      },
      "0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6": {
        "converted_points": "3000",
        "token_eligibility": {
          "converted_from_points": "300000000000000000000"
        }
      }
    }`);
    const merkeltree = await getAirdropMerkelTree(a);
    const contractInterface = new ethers.utils.Interface(HATAirdrop_abi);
    const initData = contractInterface.encodeFunctionData("initialize", [
      "QmUE1SVj7dm8gs77okSvoxSAcN3fPxBbA7BG7S76xnbsAB",
      merkeltree.getHexRoot(),
      1711772105,
      1725792105,
      1725792105,
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
