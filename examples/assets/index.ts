/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Client,
  ClientFactory,
  DefaultProviderUrls,
  IAsset,
  IGetAllAssetsFilter,
  IGetAllEntitiesResponse,
  ResponseData,
} from 'arc-client';
import * as dotenv from 'dotenv';
import {
  AssetType,
  DeployAssetModel,
  EnableAssetModel,
} from '../../src/packages/client/gen';
const path = require('path');
const chalk = require('chalk');

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

const apiKey = process.env.X_API_KEY;
if (!apiKey) {
  throw new Error('Missing X_API_KEY in .env file');
}

(async () => {
  const header = '='.repeat(process.stdout.columns - 1);
  console.log(header);
  console.log(`${chalk.green.bold('StarkExpress Assets Client Example')}`);
  console.log(header);

  try {
    console.log('Api Key ', apiKey);

    // init stark express client
    const arcClient: Client = await ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      apiKey,
    );

    // get all assets with a filter
    const allAssetsInfo: ResponseData<IGetAllEntitiesResponse<IAsset>> =
      await arcClient.assets().getAllAssetsInfo({
        assetType: AssetType.Erc20,
        pageNumber: 0,
        pageSize: 100,
      } as IGetAllAssetsFilter);

    if (allAssetsInfo.error) {
      throw new Error(JSON.stringify(allAssetsInfo.error, null, 4));
    }

    console.log(
      `Filtered Assets Info: ${JSON.stringify(allAssetsInfo.result, null, 4)}`,
    );

    // get asset id
    const assetInfo: ResponseData<IAsset> = await arcClient
      .assets()
      .getAsset((allAssetsInfo.result?.data as [IAsset])[0].assetId as string);

    if (assetInfo.error) {
      throw new Error(JSON.stringify(assetInfo.error, null, 4));
    }

    console.log(
      `StarkExpress Asset Info: ${JSON.stringify(assetInfo.result, null, 4)}`,
    );

    // deploy asset
    const deployedAsset: ResponseData<IAsset> = await arcClient
      .assets()
      .deployAsset({
        name: 'Custom Asset',
        symbol: 'EGP',
        type: AssetType.Erc721,
        uri: 'www.egp.com',
      } as DeployAssetModel);

    if (deployedAsset.error) {
      throw new Error(JSON.stringify(deployedAsset.error, null, 4));
    }

    console.log(
      `StarkExpress Deployed Asset: ${JSON.stringify(
        deployedAsset.result,
        null,
        4,
      )}`,
    );

    // enable asset
    const enabledAsset: ResponseData<IAsset> = await arcClient
      .assets()
      .enableAsset({
        assetId: '8ecce465-0e58-4d14-914c-79241d7dc773',
      } as EnableAssetModel);

    if (enabledAsset.error) {
      throw new Error(JSON.stringify(enabledAsset.error, null, 4));
    }

    console.log(
      `StarkExpress Enabled Asset: ${JSON.stringify(
        enabledAsset.result,
        null,
        4,
      )}`,
    );

    process.exit(0);
  } catch (ex) {
    const msg = chalk.red(`Error = ${ex}`);
    console.error(msg);
    process.exit(-1);
  }
})();
