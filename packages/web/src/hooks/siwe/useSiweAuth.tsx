import { Loading } from "components";
import { useOnChange } from "hooks/usePrevious";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import * as SIWEService from "./siweService";

type ISiweProfileData = {
  loggedIn: boolean;
  address?: string | undefined;
  chainId?: number | undefined;
};

export type ISiweData = { message: string; signature: `0x${string}` };

type ISiweAuthContext = {
  signIn: () => Promise<{ ok: boolean; siweData?: ISiweData }>;
  logout: () => Promise<void>;
  tryAuthentication: () => Promise<boolean>;
  updateProfile: () => Promise<ISiweProfileData>;
  profileData: ISiweProfileData;
  isSigningIn: boolean;
  isAuthenticated: boolean;
  currentSiweData?: ISiweData;
};

const SiweAuthContext = createContext<ISiweAuthContext>(undefined as any);

export const SiweAuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const { address, connector } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const [currentSiweData, setCurrentSiweData] = useState<ISiweData | undefined>();
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<{
    loggedIn: boolean;
    address?: string | undefined;
    chainId?: number | undefined;
  }>({ loggedIn: false });

  const getProfile = async () => {
    const profile = await SIWEService.profile();
    setProfileData(profile);
    return profile;
  };

  useEffect(() => {
    getProfile();

    window.addEventListener("focus", getProfile);
    return () => window.removeEventListener("focus", getProfile);
  }, []);

  useOnChange(address, (newVal, prevVal) => {
    if (prevVal && !newVal) logout();
    if (prevVal && newVal && prevVal !== newVal) logout();
  });

  useEffect(() => {
    if (address && profileData.address && address !== profileData.address) logout();
  }, [address, profileData]);

  const signIn = useCallback(async (): Promise<{ ok: boolean; siweData?: ISiweData }> => {
    if (!connector || !address || !chain) return { ok: false };

    try {
      setIsSigningIn(true);

      const chainId = chain?.id;
      const nonce = await SIWEService.getNonce();

      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Hats.finance wants you to Sign In With Ethereum in order to execute that action.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      const preparedMessage = message.prepareMessage();
      const signature = await signMessageAsync({ message: preparedMessage });
      const siweData = { message: preparedMessage, signature };
      setCurrentSiweData(siweData);

      // Verify signature
      const verifyOk = await SIWEService.verifyMessage(message, signature);
      if (!verifyOk) throw new Error("Error verifying message");

      setIsSigningIn(false);
      getProfile();

      return { ok: true, siweData };
    } catch (error) {
      console.log(error);

      setIsSigningIn(false);

      return { ok: false };
    }
  }, [connector, address, chain, signMessageAsync]);

  const tryAuthentication = useCallback(async (): Promise<boolean> => {
    const profile = await getProfile();
    if (!profile.loggedIn) {
      const authenticated = (await signIn()).ok;
      return authenticated;
    }

    return true;
  }, [signIn]);

  const logout = async (): Promise<void> => {
    await SIWEService.logout();
    setProfileData({ loggedIn: false });
  };

  const context = {
    signIn,
    logout,
    isSigningIn,
    profileData,
    tryAuthentication,
    isAuthenticated: profileData.loggedIn,
    updateProfile: getProfile,
    currentSiweData,
  };

  return (
    <SiweAuthContext.Provider value={context}>
      {children}
      {isSigningIn && <Loading fixed extraText={`${t("signingInWithEthereum")}...`} />}
    </SiweAuthContext.Provider>
  );
};

export const useSiweAuth = () => {
  return useContext(SiweAuthContext);
};
