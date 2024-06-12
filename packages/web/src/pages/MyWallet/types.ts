import { BigNumber } from "ethers";
import { DropData } from "pages/Airdrops/types";

export type UserPointsData = {
  username: string | undefined;
  farcasterId: number | undefined;
  address: string | undefined;
  hatsPoints: number;
  hatsPointsLogs: HATPointsLog[];
};

export type HATPointsLog = {
  date: Date;
  action: string;
  points: number;
  metadata: PointsLogMetadata;
};

export type PointsLogMetadata = {
  vaultAddress: string | undefined;
  payoutId: string;
  winners?: string[];
  totalPointsToDistribute?: number;
  totalWinningPoints?: number;
  finalVote?: {
    fid: number;
    points: number;
    vote: string;
    castHash: string;
  };
  source?: "PAYOUT_EXECUTION"; // if undefined it's from a game

  // For distributePointsOnPayout
  payoutType?: "single" | "split";
  severity?: string;
  beneficiary?: string;
  streakCount?: number;
  isOptedIn?: boolean;
  mainPrize?: number;
  optedInBonus?: number;
  streakMultiplierBonus?: number;
};

export type DropDataConvertible = DropData & {
  points: number;
  tokens: BigNumber;
};
