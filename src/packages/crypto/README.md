# arc-crypto-utils ![Node CI](https://github.com/threesigmaxyz/arc-crypto-utils/workflows/Node.js%20CI/badge.svg)

![check-code-coverage](https://img.shields.io/badge/coverage-%25-red)

`arc-crypto-utils` is a TypeScript library that exposes crypto-related functionalities required by the `Arc` L2 blockchain.

## Usage

`arc-crypto-utils` could be used as a library for frameworks or as a stand-alone bundled js file which can be easily loaded into the browser.

### Library (Node.js/React/Vue.js) usage

> npm install @threesigma/arc-crypto-utils

### Browser usage

Add the following script to your html file:

```ts
<script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/npm/@threesigma/arc-crypto-utils@x.x.x/bundle.js"
></script>
```

whereby the x.x.x is one of the available released versions

In your code, once the script is fully loaded, just use `window.arcCryptoUtils` to access all `arcCryptoUtils` exports.

```ts
<script>console.log("Arc Crypto Utils ", window.arcCryptoUtils);</script>
```

> **PREREQUISITES:**
> 
>    - NodeJS 16+
>    - npm / yarn (see package.json)

### Web3 Client initialization

```ts
import {
  CryptoUtils, ICryptoUtils
} from "@threesigma/arc-crypto-utils";


// init cryptoUtils
const cryptoUtils: ICryptoUtils = new CryptoUtils();
await cryptoUtils.init('some message');

```

### Client Exposed APIs

The client exposes several APIs for accessing different parts of the Arc domain:

```ts
cryptoUtils.user() -> sub-client for users api (interface: IUserClient)
cryptoUtils.withdraws() -> sub-client for withdraws api (interface: IMintClient)
cryptoUtils.transfers() -> sub-client for transfers api (interface: ITransferClient)
cryptoUtils.deposits() -> sub-client for deposits api (interface: IDepositClient)

```

### Users API

Client public API operations are accessible under the users sub-client, which is accessible via the `user()` method on the client.

Example:

```ts

// get signed register details
const registerModel = await cryptoUtils
  .user()
  .signRegisterDetails('username', registerDetails);

```

### Withdraw API

Client public API operations are accessible under the assets sub-client, which is accessible via the `withdraws()` method on the client.

Example:

```ts

// onchain withdraw
await cryptoUtils.withdraws().withdrawOnChain(withdrawDetails);
```

### Transfers API

Client public API operations are accessible under the assets sub-client, which is accessible via the `transfers()` method on the client.

Example:

```ts

const signature = cryptoUtils.transfers().signTransfer(transferDetailsDto);
```

### Deposits API

Client public API operations are accessible under the assets sub-client, which is accessible via the `deposits()` method on the client.

Example:

```ts

await cryptoUtils.deposits().deposit(depositDetails);
```

### Settlements API

Client public API operations are accessible under the assets sub-client, which is accessible via the `settlementss()` method on the client.

Example:

```ts
const orderData: OrderDataDto = {
  sellQuantizedAmount: '21415926535',
  buyQuantizedAmount: '1',
  sellVaultChainId: 1,
  buyVaultChainId: 2,
  expirationTimestamp: 123123123,
  nonce: 123,
  assetBuy: '0x123abcafff',
  assetSell: '0x123abca123',
};

await cryptoUtils.settlements().signOrder(orderData);
```

## Contributing and testing

1. Run `npm run install` to install all deps
2. Run `npm run build` to build distribution content
3. Run `npm run test` to run integration and unit tests