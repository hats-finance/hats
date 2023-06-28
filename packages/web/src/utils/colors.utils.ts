function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/iu.exec(hex);
  if (!result) return null;

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function rgbToHex(rgb: { r: number; g: number; b: number }) {
  const { r, g, b } = rgb;
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function interpolateColor(start: { r: number; g: number; b: number }, end: { r: number; g: number; b: number }, percent: number) {
  const result = ["r", "g", "b"].map((i) => Math.round(start[i] + (end[i] - start[i]) * percent));
  return { r: result[0], g: result[1], b: result[2] };
}

export const generateColorsArrayInBetween = (startColorHex: string, endColorHex: string, steps: number) => {
  const startColorRgb = hexToRgb(startColorHex);
  const endColorRgb = hexToRgb(endColorHex);

  if (!startColorRgb || !endColorRgb) return [];

  const colorsArray: string[] = [];

  for (let i = 0; i < steps; i++) {
    const color = interpolateColor(startColorRgb, endColorRgb, i / steps);
    colorsArray.push(rgbToHex(color));
  }

  return colorsArray;
};
