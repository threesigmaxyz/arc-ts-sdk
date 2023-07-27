# starkexpress-ts-sdk

`starkexpress-ts-sdk` is a TypeScript library that allow you to interact with the `StarkExpress` L2 blockchain and use all of its features.

## Usage

`starkexpress-ts-sdk` could be used as a library for frameworks or as a stand-alone bundled js file which can be easily loaded into the browser.

### Library (Node.js/React/Vue.js) usage

> npm install @threesigma/starkexpress-ts-sdk

### Browser usage

Add the following script to your html file:

```ts
<script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/npm/@threesigma/starkexpress-ts-sdk@x.x.x/bundle.js"
></script>
```

whereby the x.x.x is one of the available released versions

In your code, once the script is fully loaded, just use `window.starkexpress` to access all `starkexpress-ts-sdk` exports.

```ts
<script>console.log("StarkExpress Client ", window.starkexpress);</script>
```

### Requirements

-   NodeJS 16+
-   npm / yarn (see package.json)

### Web3 Client initialization


```ts
import {
    ClientFactory, DefaultProviderUrls
} from "@threesigma/starkexpress-ts-sdk";

const API_KEY = "xxxxxxx";

// init stark express client
const starkExpressClient: Client = await ClientFactory.createDefaultClient(
    DefaultProviderUrls.TESTNET,
    API_KEY,
);

```

### Client Exposed APIs

The client exposes several APIs for accessing different parts of the StarkExpress domain:

```ts
starkExpressClient.user() -> sub-client for users api (interface: IUserClient)
TODO

```

### Users API

Client public API operations are accessible under the users sub-client, which is accessible via the `user()` method on the client.

Example:

```ts
import {
   IRegisteredUser, IStarkExpressAccount
} from "@threesigma/starkexpress-ts-sdk";

// generate a new starkexpress account using ethereum private key
const starkExpressAccount: IStarkExpressAccount = starkExpressClient.user().generateStarkAccount("0x0.....");

// register a new starkexpress user
const registeredUser: IRegisteredUser = await starkExpressClient.user().registerStarkUser("STAREX_USERNAME", starkExpressAccount);

```

## Contributing and testing

1. Run `npm run install` to install all deps
2. Run `npm run build` to build distribution content
3. Run `npm run test` to run integration and unit tests