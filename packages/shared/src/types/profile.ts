export interface IHackerProfile {
  username: string;
  addresses: string[];
  title?: string;
  avatar?: string;
  bio?: string;
  twitter_url?: string;
  github_url?: string;
  updatedAt: Date;
  createdAt: Date;
}
