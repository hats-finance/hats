export interface IHackerProfile {
  username: string;
  addresses: string[];
  title?: string;
  avatar?: string;
  bio?: string;
  twitter_username?: string;
  github_username?: string;
  updatedAt: Date;
  createdAt: Date;
}
