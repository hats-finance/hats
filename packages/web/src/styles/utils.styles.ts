const SPACING_UNNIT = 8;

const getSpacing = (spacing: number) => {
  return `${spacing * SPACING_UNNIT}px`;
};

const getPrimaryGradient = () => {
  return `linear-gradient(90deg, var(--background-2) 0%, var(--primary) 100%);`;
};

export { getSpacing, getPrimaryGradient };
