# starkexpress-ts-sdk ![Node CI](https://github.com/threesigmaxyz/starkexpress-ts-sdk/workflows/Node.js%20CI/badge.svg)

![check-code-coverage](https://img.shields.io/badge/coverage-%25-red)

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

> **PREREQUISITES:**
> 
>    - NodeJS 16+
>    - npm / yarn (see package.json)

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
starkExpressClient.assets() -> sub-client for assets api (interface: IAssetsClient)
starkExpressClient.fees() -> sub-client for fees api (interface: IFeeModelClient)
starkExpressClient.mints() -> sub-client for mints api (interface: IMintClient)
starkExpressClient.withdraws() -> sub-client for withdraws api (interface: IMintClient)


```

### Users API

Client public API operations are accessible under the users sub-client, which is accessible via the `user()` method on the client.

Example:

```ts
import {
   IRegisteredUser,
   IStarkExpressAccount,
   IUserInfo,
   IGetAllEntitiesResponse,
   ITEM_COMPARISON,
   IGetAllUsersFilter,
   ResponseData
} from "@threesigma/starkexpress-ts-sdk";

// generate a new starkexpress account using ethereum private key
const starkExpressAccount: IStarkExpressAccount = starkExpressClient.user().generateStarkAccount("ETHEREUM_PRIVATE_KEY");

// register a new starkexpress user
const registeredUser: ResponseData<IRegisteredUser> = await starkExpressClient.user().registerStarkUser("STAREX_USERNAME", starkExpressAccount);

// get full user info by id
const userInfo: ResponseData<IUserInfo> = await starkExpressClient.user().getUserInfo(registeredUser.userId);

// get all users with a filter
const usersInfo: ResponseData<IGetAllEntitiesResponse<IRegisteredUser>> = await starkExpressClient.user().getAllUsersInfo({
    username: 'SOME_SEARCH_STRING',
    usernameComparison: ITEM_COMPARISON.CONTAINS,
    pageNumber: 0,
    pageSize: 100,
} as IGetAllUsersFilter);

```

### Assets API

Client public API operations are accessible under the assets sub-client, which is accessible via the `assets()` method on the client.

Example:

```ts

import {
   IAsset,
   IGetAllEntitiesResponse,
   ASSET_TYPE,
   IGetAllAssetsFilter,
   ResponseData,
   IDeployAssetPayload
} from "@threesigma/starkexpress-ts-sdk";

// get all assets with a filter
const allAssetsInfo: ResponseData<IGetAllEntitiesResponse<IAsset>> = await starkExpressClient.assets().getAllAssetsInfo({
    assetType: ASSET_TYPE.ERC_721,
    pageNumber: 0,
    pageSize: 100,
} as IGetAllAssetsFilter);

// get full asset info by id
const assetInfo: ResponseData<IAsset> = await starkExpressClient
    .assets()
    .getAsset((allAssetsInfo.result?.data as [IAsset])[0].assetId);


// deploy asset
const createdAsset: ResponseData<IAsset> = await starkExpressClient
    .assets()
    .deployAsset({
    name: "Custom Asset",
    symbol: "EGP",
    type: ASSET_TYPE.ERC_721,
    uri: "www.egp.com"
    } as IDeployAssetPayload);

// enable asset
const enabledAsset: ResponseData<IAsset> = await starkExpressClient
    .assets()
    .enableAsset("8ecce465-0e58-4d14-914c-79241d7dc773");

```

### Fees API

Client public API operations are accessible under the assets sub-client, which is accessible via the `fees()` method on the client.

Example:

```ts

import {
   IConfigureFeeModelPayload,
   FeeAction,
   ResponseData,
   IFeeModel
} from "@threesigma/starkexpress-ts-sdk";

// configure fee Model
const configuredFeeModel: ResponseData<IFeeModel> = await starkExpressClient
    .fees()
    .configureFeeModel({
    feeAction: FeeAction.TRANSFER,
    basisPoints: 100,
    } as IConfigureFeeModelPayload);

// get fee model
const feeModel: ResponseData<IFeeModel> = await starkExpressClient
    .fees()
    .getFeeModel(configuredFeeModel.result?.feeId as string);

```

### Mints API

Client public API operations are accessible under the assets sub-client, which is accessible via the `mints()` method on the client.

Example:

```ts

import {
  ResponseData,
  BatchMintRequestModel,
  DataAvailabilityModes,
  IVault
} from "@threesigma/starkexpress-ts-sdk";

// Mint assets
const mintAsseets: ResponseData<{ [key: string]: Array<IVault> }> = await starkExpressClient
    .mints()
    .mintAssets({
      users: [
        {
          userId: "842c0784-6825-4cdf-8cc2-a43d5a97d54c",
          mints: [
            {
              mintingBlob: "0xdeadbeef",
              assetId: "842c0785-6825-4cdf-8cc2-a43d5a97d54c",
              amount: "100",
              dataAvailabilityMode: DataAvailabilityModes.ZkRollup,
            }
          ]
        }
        ],
    } as BatchMintRequestModel);
```

The token ID is encoded in a compressed form called the minting blob, which is required in order to withdraw on-chain.

### Withdraw API

Client public API operations are accessible under the assets sub-client, which is accessible via the `withdraws()` method on the client.

Example:

```ts

import {
  ResponseData,
  WithdrawDetailsDto,
  WithdrawModel,
} from "@threesigma/starkexpress-ts-sdk";

// Withdraw asset off-chain
const withdrawData: WithdrawModel = {
  vaultId: '6554d7c3-364e-4536-9cd7-bb0ce8f7c600',
  amount: '65350000',
};

const withdraw: ResponseData<WithdrawDetailsDto> = await starkExpressClient
  .withdraws()
  .withdraw(withdrawData);

// on-chain Withdraw
await starkExpressClient.withdraws().withdrawOnChain(withdraw.result);
```

## Operations API
// TODO Client public API operations are accessible under the assets sub-client, which is accessible via the `fees()` method on the client.

TODO

- Transfer
- Transactional
- Deposit

### Vault API
TODO

### Orders API
WIP

### Settlement API
WIP

## Contributing and testing

1. Run `npm run install` to install all deps
2. Run `npm run build` to build distribution content
3. Run `npm run test` to run integration and unit tests