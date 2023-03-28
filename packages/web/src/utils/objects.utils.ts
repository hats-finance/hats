// eslint-disable-next-line no-useless-escape
const splitChars = /[\.\[\]\'\"]/;
export function setPath(object, path, value) {
  return path.split(splitChars).reduce((o, p, i) => (o[p] = path.split(splitChars).length === ++i ? value : o[p] || {}), object);
}

export function getPath(object, path) {
  return path.split(splitChars).reduce((o, p) => o && o[p], object);
}

export function removeEmpty(obj: any) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null && v !== "")
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
  );
}
