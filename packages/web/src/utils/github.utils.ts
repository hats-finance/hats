export const isGithubUsernameValid = async (username: string) => {
  const response = await fetch(`https://api.github.com/users/${username}`);
  return response.status === 200;
};
