import { IS_PROD } from "settings";

const CLOSE_REG_DEV = 60 * 30;
const CLOSE_REG_PROD = 60 * 60 * 24;

export const closeRegTimeBeforeCompetition = IS_PROD ? CLOSE_REG_PROD : CLOSE_REG_DEV;
