# arc-ts-sdk ![Node CI](https://github.com/threesigmaxyz/arc-ts-sdk/workflows/Node.js%20CI/badge.svg)

![check-code-coverage](https://img.shields.io/badge/coverage-%25-red)

This is the repo that contains both ARC TypeScript SDKs that allow you to interact with the `Arc` L2 blockchain
and use all of its features. A crypto utils SDK located in `src/packages/crypto` to aid with cryptograhic operations in
user applications, and a client SDK located in `src/packages/client` to help integrate with the Arc HTTP API.

To see fully working examples check the `examples` folder which shows how both sdks
can be combined to fully integrate with the Arc system.

> **PREREQUISITES:**
> 
>    - NodeJS 16+
>    - npm / yarn (see package.json)

## Contributing and testing

1. Run `npm run install` to install all deps
2. Run `npm run build` to build distribution content
3. Run `npm run test` to run integration and unit tests