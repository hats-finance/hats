const SPACING_UNNIT = 8;

const getSpacing = (spacing: number) => {
  return `${spacing * SPACING_UNNIT}px`;
};

const getPrimaryGradient = () => {
  return `linear-gradient(90deg, var(--background-2) 0%, var(--primary) 100%);`;
};

const getPrimaryGradientVariant = () => {
  return ` linear-gradient(114deg, #343B79 5.68%, #816FFF 49.92%, #502873 88.92%);`;
};

export { getSpacing, getPrimaryGradient, getPrimaryGradientVariant };
