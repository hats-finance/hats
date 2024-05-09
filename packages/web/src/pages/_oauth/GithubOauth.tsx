import { LocalStorage } from "constants/constants";
import { RoutePaths } from "navigation";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

const OAUTH_NAME = "github";

export const GithubOauth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { address: account } = useAccount();
  const { data: createdProfile, isLoading: isLoadingProfile } = useProfileByAddress(account);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    console.log(`GithubOauth state: code: ${code}`);
    localStorage.setItem(`${LocalStorage.oauthData}_${OAUTH_NAME}`, JSON.stringify({ code }));
  }, [searchParams]);

  useEffect(() => {
    if (!createdProfile) return;
    navigate(`${RoutePaths.profile}/${createdProfile.username}?oauth=${OAUTH_NAME}`, { replace: true });
  }, [createdProfile, navigate]);

  return <div>{isLoadingProfile ? "Loading..." : ""}</div>;
};
