import { HATAirdrop_abi } from "@hats.finance/shared";
import AirdropVideoMobile from "assets/videos/airdrop-v2-mobile.mp4";
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

  // const createAirdropHelper = async () => {
  //   const a = JSON.parse(``);
  //   const merkeltree = await getAirdropMerkelTree(a);
  //   const contractInterface = new ethers.utils.Interface(HATAirdrop_abi);
  //   const initData = contractInterface.encodeFunctionData("initialize", [
  //     "QmUPNDZHkjwjT4d7wwqfAngLDxFcTsqEJwR2Ed7ggL5uny",
  //     merkeltree.getHexRoot(),
  //     1716122240,
  //     1719222240,
  //     1719222240,
  //     60,
  //     "0xbdb34BB8665510d331FacAAaA0eeAe994a5B6612",
  //     "0x0153A75550E32CDf9a4458301bb89b600e745EAf",
  //   ]);

  //   console.log(initData);
  // };

  return (
    <StyledAirdropsPage className="content-wrapper">
      {/* <button onClick={createAirdropHelper}>Test</button> */}
      <div className="hero">
        <video id="airdrop-video" autoPlay muted playsInline>
          <source src={AirdropVideo} type="video/mp4" />
        </video>
        <video id="airdrop-video-mobile" autoPlay muted playsInline loop>
          <source src={AirdropVideoMobile} type="video/mp4" />
        </video>
        <div className="buttons">
          <a href="#check-elegibility">
            <Button>{t("Airdrop.checkElegibility")}</Button>
          </a>
        </div>
      </div>

      <HatsTokenInfo />
      <AirdropCheckElegibility />
      <AirdropFAQ />
    </StyledAirdropsPage>
  );
};
