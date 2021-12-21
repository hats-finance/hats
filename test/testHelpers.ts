export function setLocalStorage(values = {}) {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn((property) => {
        console.log(
          `getItem from localStorage: ${property}, ${values[property]}`
        );
        return values[property] || null;
      }),
      setItem: jest.fn(() => null),
    },
    writable: true,
  });
}
