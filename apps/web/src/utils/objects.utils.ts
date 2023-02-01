// eslint-disable-next-line no-useless-escape
const splitChars = /[\.\[\]\'\"]/
export function setPath(object, path, value) {
    return path
        .split(splitChars)
        .reduce((o, p, i) => o[p] = path.split(splitChars).length === ++i ? value : o[p] || {}, object)
}

export function getPath(object, path) {
    return path
        .split(splitChars)
        .reduce((o, p) => o && o[p], object)
}
