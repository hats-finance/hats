# 🎩 Hats Finance Frontend

<p align="center">
  <a href="https://app.hats.finance">
      <img src="https://app.hats.finance/logo.png" height="128">
  </a>
</p>

This project contains all the packages of the Hats Finance app.

## Documentation

## `packages/web`
This is the main code for the Hats Finance dApp.

You can run it on the root folder (recommended) with:
```sh
yarn install
yarn run dev
```

Or, you can run it under `packages/web`:
```sh
yarn start
```

## `packages/shared`
This is a ***npm library*** with the shared code we use in more than one repo.
It contains shared types, contracts abis, supported chains config and some utils functions.

You can build it under `packages/shared` with:
```sh
yarn build
```

In order to publish a new verion on npm, you need to:

1. Increase the version number in `packages/shared/package.json`.
2. Build and publish the package with:
    ```sh
    npm run publish
    ```