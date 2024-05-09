export interface IHackerProfile {
  _id?: string;
  username: string;
  addresses: string[];
  title?: string;
  avatar?: string;
  bio?: string;
  twitter_username?: string;
  github_username?: string;
  updatedAt: Date;
  createdAt: Date;
  oauth?: {
    twitter?: { id: string; name: string; username: string };
    github?: { id: string; name: string; username: string };
  };
}
