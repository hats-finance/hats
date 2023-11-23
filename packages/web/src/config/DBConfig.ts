export enum IndexedDBs {
  DecryptedSubmissions = "decrypted-submissions",
}

export const DBConfig = {
  name: "HatsFinanceDB",
  version: 1,
  objectStoresMeta: [
    {
      store: IndexedDBs.DecryptedSubmissions,
      storeConfig: { keyPath: "subId", autoIncrement: false },
      storeSchema: [],
    },
  ],
};
