/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { Client } from '../../src/web3/Client';
import {
  ClientFactory,
  DefaultProviderUrls,
} from '../../src/web3/ClientFactory';
import { IGetAllEntitiesResponse } from '../../src/interfaces/IGetAllEntitiesResponse';
import { ResponseData } from '../../src/interfaces/ResponseData';
import { IAsset } from '../../src/interfaces/IAsset';
import { IGetAllAssetsFilter } from '../../src/interfaces/IGetAllAssetsFilter';
import { AssetType, DeployAssetModel, EnableAssetModel } from '../../src/gen';
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
    const starkExpressClient: Client = await ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      apiKey,
      true,
    );

    // get all assets with a filter
    const allAssetsInfo: ResponseData<IGetAllEntitiesResponse<IAsset>> =
      await starkExpressClient.assets().getAllAssetsInfo({
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
    const assetInfo: ResponseData<IAsset> = await starkExpressClient
      .assets()
      .getAsset((allAssetsInfo.result?.data as [IAsset])[0].assetId as string);

    if (assetInfo.error) {
      throw new Error(JSON.stringify(assetInfo.error, null, 4));
    }

    console.log(
      `StarkExpress Asset Info: ${JSON.stringify(assetInfo.result, null, 4)}`,
    );

    // deploy asset
    const deployedAsset: ResponseData<IAsset> = await starkExpressClient
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
    const enabledAsset: ResponseData<IAsset> = await starkExpressClient
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
