# arc-ts-sdk ![Node CI](https://github.com/threesigmaxyz/arc-ts-sdk/workflows/Node.js%20CI/badge.svg)

![check-code-coverage](https://img.shields.io/badge/coverage-%25-red)

`arc-ts-sdk` is a TypeScript library that allow you to interact with the `Arc` L2 blockchain and use all of its features.

## Usage

`arc-ts-sdk` could be used as a library for frameworks or as a stand-alone bundled js file which can be easily loaded into the browser.

### Library (Node.js/React/Vue.js) usage

> npm install @threesigma/arc-ts-sdk

### Browser usage

Add the following script to your html file:

```ts
<script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/npm/@threesigma/arc-ts-sdk@x.x.x/bundle.js"
></script>
```

whereby the x.x.x is one of the available released versions

In your code, once the script is fully loaded, just use `window.arc` to access all `arc-ts-sdk` exports.

```ts
<script>console.log("Arc Client ", window.arc);</script>
```

> **PREREQUISITES:**
> 
>    - NodeJS 16+
>    - npm / yarn (see package.json)

### Web3 Client initialization


```ts
import {
    ClientFactory, DefaultProviderUrls
} from "@threesigma/arc-ts-sdk";

const API_KEY = "xxxxxxx";

// init stark express client
const starkExpressClient: Client = await ClientFactory.createDefaultClient(
    DefaultProviderUrls.TESTNET,
    API_KEY,
);

```

### Client Exposed APIs

The client exposes several APIs for accessing different parts of the Arc domain:

```ts
starkExpressClient.user() -> sub-client for users api (interface: IUserClient)
starkExpressClient.assets() -> sub-client for assets api (interface: IAssetsClient)
starkExpressClient.fees() -> sub-client for fees api (interface: IFeeModelClient)
starkExpressClient.mints() -> sub-client for mints api (interface: IMintClient)
starkExpressClient.withdraws() -> sub-client for withdraws api (interface: IMintClient)
starkExpressClient.transfers() -> sub-client for transfers api (interface: ITransferClient)
starkExpressClient.deposits() -> sub-client for deposits api (interface: IDepositClient)

```

### Users API

Client public API operations are accessible under the users sub-client, which is accessible via the `user()` method on the client.

Example:

```ts
import {
   IRegisteredUser,
   IArcAccount,
   IUserInfo,
   IGetAllEntitiesResponse,
   ITEM_COMPARISON,
   IGetAllUsersFilter,
   ResponseData
} from "@threesigma/arc-ts-sdk";

// generate a new arc account using ethereum private key
const starkExpressAccount: IArcAccount = starkExpressClient.user().generateStarkAccount("ETHEREUM_PRIVATE_KEY");

// register a new arc user
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
} from "@threesigma/arc-ts-sdk";

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
} from "@threesigma/arc-ts-sdk";

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
} from "@threesigma/arc-ts-sdk";

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
} from "@threesigma/arc-ts-sdk";

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

### Transfers API

Client public API operations are accessible under the assets sub-client, which is accessible via the `transfers()` method on the client.

Example:

```ts

import {
  ResponseData,
  TransferDetailsModel,
  DataAvailabilityModes,
  VaultDto
} from "@threesigma/arc-ts-sdk";

// Transfer asset model
const transferData: TransferDetailsModel = {
  senderUserId: '5a35dbab-02ba-4ed4-b799-59daa263488b',
  receiverUserId: '5a35dbab-02ba-4ed4-b799-59daa263488c',
  assetId: 'ba072cae-a82d-4c9b-b663-1f98cc8c38d1',
  senderDataAvailabilityMode: DataAvailabilityModes.Validium,
  receiverDataAvailabilityMode: DataAvailabilityModes.Validium,
  amount: '214159265350000',
};

// Send transfer request
const transfer: ResponseData<Array<VaultDto>> = await starkExpressClient
  .transfers()
  .transferAsset(transferData);;
```

### Deposits API

Client public API operations are accessible under the assets sub-client, which is accessible via the `deposits()` method on the client.

Example:

```ts

import {
  ResponseData,
  DepositDetailsModel,
  DataAvailabilityModes
} from "@threesigma/arc-ts-sdk";

// Execute deposit
const depositResponse = await starkExpressClient.deposit().depositAssets({
  userId: '5a35dbab-02ba-4ed4-b799-59daa263488b',
  dataAvailabilityMode: DataAvailabilityModes.Validium,
  assetId: 'ba072cae-a82d-4c9b-b663-1f98cc8c38d1',
  amount: '10000',
} as DepositDetailsModel);
```


### Vault API
TODO

### Orders API
WIP

## Contributing and testing

1. Run `npm run install` to install all deps
2. Run `npm run build` to build distribution content
3. Run `npm run test` to run integration and unit tests